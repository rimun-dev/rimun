import { TRPCError } from "@trpc/server";
import * as bcrypt from "bcrypt";
import Jimp from "jimp";
import { z } from "zod";
import { Context } from "../trpc";

export const identifierSchema = z.number().int();
export const genderSchema = z.enum(["m", "f", "nb"]);
export const applicationStatusSchema = z.enum(["ACCEPTED", "REFUSED", "HOLD"]);
export const housingStatusSchema = z.enum([
  "ACCEPTED",
  "REFUSED",
  "HOLD",
  "NOT_REQUIRED",
]);
export const accountBaseSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export const personBaseSchema = z.object({
  name: z.string(),
  surname: z.string(),
  birthday: z.date(),
  gender: z.enum(["f", "m", "nb"]),
  picture: z.string(),
  phone_number: z.string(),
  country_id: z.number(),
  tshirt_size: z.enum(["s", "m", "l", "xl"]),
  allergies: z.string().nullable(),
});

export async function hashPassword(password: string) {
  const hashSalt = await bcrypt.genSalt();
  return await bcrypt.hash(password, hashSalt);
}

export async function getPersonUser(ctx: Context) {
  if (!ctx.userId)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "This user is not authorized.",
    });

  const user = await ctx.prisma.person.findUnique({
    where: { id: ctx.userId },
    include: {
      account: true,
      permissions: true,
      applications: true,
    },
  });

  if (!user)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "This user is not authorized.",
    });

  return user;
}

export async function getSchoolUser(ctx: Context) {
  if (!ctx.userId)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "This user is not authorized.",
    });

  const user = await ctx.prisma.school.findUnique({
    where: { id: ctx.userId },
    include: {
      account: true,
      applications: true,
    },
  });

  if (!user)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "This user is not authorized.",
    });

  return user;
}

export async function getCurrentSession(ctx: Context) {
  const session = await ctx.prisma.session.findFirst({
    where: { is_active: true },
  });
  if (!session)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "There is no active session.",
    });
  return session;
}

export async function getGroup(name: string, ctx: Context) {
  const group = await ctx.prisma.group.findFirst({
    where: { name },
  });
  if (!group)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "There is no group with this name.",
    });
  return group;
}

export async function getRole(name: string, group_id: number, ctx: Context) {
  const role = await ctx.prisma.role.findFirst({
    where: { name, group_id },
  });
  if (!role)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "There is no role with this name.",
    });
  return role;
}

interface CheckPersonPermissionOpts {
  resourceName?: string;
  userGroupName?: string;
}

export async function checkPersonPermission(
  ctx: Context,
  { resourceName, userGroupName }: CheckPersonPermissionOpts
) {
  const currentSession = await getCurrentSession(ctx);
  const currentUser = await getPersonUser(ctx);

  if (currentUser.account?.is_admin) return;

  let hasGroupPermissions = false;
  if (userGroupName) {
    const group = await ctx.prisma.group.findUnique({
      where: { name: userGroupName },
    });
    hasGroupPermissions =
      !!group &&
      currentUser.applications.filter(
        (a) =>
          a.session_id === currentSession.id &&
          a.confirmed_group_id === group.id
      ).length > 0;
  }

  if (hasGroupPermissions) return;

  let hasExplicitPermission = false;
  if (resourceName) {
    const resource = await ctx.prisma.resource.findUnique({
      where: { name: resourceName },
    });

    hasExplicitPermission =
      !!resource &&
      currentUser.permissions.filter(
        (p) =>
          p.session_id == currentSession.id && p.resource_id === resource.id
      ).length > 0;
  }

  if (hasExplicitPermission) return;

  throw new TRPCError({
    code: "UNAUTHORIZED",
    message: "You are not authorized.",
  });
}

export async function resetSchoolSessionData(
  school_id: z.infer<typeof identifierSchema>,
  status_application: z.infer<typeof applicationStatusSchema>,
  ctx: Context
) {
  const currentSession = await getCurrentSession(ctx);

  await ctx.prisma.schoolGroupAssignment.updateMany({
    where: { school_id, session_id: currentSession.id },
    data: { n_confirmed: status_application === "REFUSED" ? 0 : null },
  });

  await ctx.prisma.personApplication.updateMany({
    where: { session_id: currentSession.id, school_id },
    data: { status_application },
  });

  const personIds = (
    await ctx.prisma.personApplication.findMany({
      where: { session_id: currentSession.id, school_id },
      select: { person_id: true },
    })
  ).map((p) => p.person_id!);

  await ctx.prisma.housingMatch.deleteMany({
    where: {
      OR: {
        host_id: { in: personIds },
        guest_id: { in: personIds },
      },
    },
  });
}

export async function resetSchoolHousingSessionData(
  school_id: z.infer<typeof identifierSchema>,
  status_housing: z.infer<typeof housingStatusSchema>,
  ctx: Context
) {
  const currentSession = await getCurrentSession(ctx);

  await ctx.prisma.personApplication.updateMany({
    where: { session_id: currentSession.id, school_id },
    data: { status_housing },
  });

  if (status_housing !== "ACCEPTED") {
    const personIds = (
      await ctx.prisma.personApplication.findMany({
        where: { session_id: currentSession.id, school_id },
        select: { person_id: true },
      })
    ).map((p) => p.person_id!);

    await ctx.prisma.housingMatch.deleteMany({
      where: {
        OR: {
          host_id: { in: personIds },
          guest_id: { in: personIds },
        },
      },
    });
  }
}

export async function checkUserPermissionToUpdatePersonApplication(
  ctx: Context,
  person_id: number,
  resourceName: string
) {
  if (!ctx.userId)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be authenticated.",
    });

  const account = await ctx.prisma.account.findUnique({
    where: { id: ctx.userId },
  });
  if (!account)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be authenticated.",
    });

  if (!account.is_school) await checkPersonPermission(ctx, { resourceName });

  const currentSession = await getCurrentSession(ctx);

  if (account.is_school) {
    const personApplication = await ctx.prisma.personApplication.findUnique({
      where: {
        person_id_session_id: {
          person_id: person_id,
          session_id: currentSession.id,
        },
      },
      include: { school: true },
    });

    if (personApplication?.school?.account_id !== ctx.userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to update this person's application.",
      });
  }
}

export async function getImageBuffer(base64: string) {
  const { type, data } = parseBase64Image(base64);
  try {
    const jimp = (await Jimp.read(Buffer.from(data, "base64"))).quality(90);
    return { data: await jimp.getBufferAsync(type), type };
  } catch {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This image format is not supported.",
    });
  }
}

export async function getThumbnailImageBuffer(base64: string) {
  const { type, data } = parseBase64Image(base64);
  try {
    const jimp = (await Jimp.read(Buffer.from(data, "base64")))
      .resize(128, Jimp.AUTO)
      .quality(70);
    return { data: await jimp.getBufferAsync(type), type };
  } catch {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This image format is not supported.",
    });
  }
}

function parseBase64Image(base64: string): { type: string; data: string } {
  try {
    const [meta, data] = base64.split(",", 2);
    const type = meta.split(";")[0];
    return { type, data };
  } catch {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This image format is not supported.",
    });
  }
}

export function getDocumentBuffer(base64: string) {
  const { type, data } = parseBase64Image(base64);
  const buffer = Buffer.from(data, "base64");
  return { data: buffer, type };
}

export function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
