import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../database";
import Storage from "../storage";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  getPersonUserFromAccountId,
  getThumbnailImageBuffer,
  hashPassword,
} from "./utils";

const profilesRouter = trpc.router({
  /** Get Profile information for a given person. */
  getPersonProfile: authenticatedProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await prisma.person.findUnique({
        where: { id: input },
        include: {
          applications: true,
          account: {
            select: { password: false },
          },
        },
      });
    }),

  /** Get Profile information for a given school. */
  getSchoolProfile: authenticatedProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await prisma.school.findUnique({
        where: { id: input },
        include: {
          applications: true,
          school_group_assignments: { include: { group: true } },
          account: {
            select: { password: false },
          },
        },
      });
    }),

  /** Update Profile information for a given person. */
  updatePersonProfile: authenticatedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        surname: z.string().optional(),
        birthday: z.date().optional(),
        gender: z.enum(["f", "m", "nb"]).optional(),
        picture: z.string().optional(),
        phone_number: z.string().optional(),
        country_id: z.number().optional(),
        tshirt_size: z.enum(["s", "m", "l", "xl"]).optional(),
        allergies: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const currentUser = await getPersonUserFromAccountId(ctx.userId);

      let picture_path = currentUser.picture_path;
      if (input.picture) {
        const picture = await getThumbnailImageBuffer(input.picture);
        picture_path = await Storage.upload(
          picture.data,
          picture.type,
          "img/profile"
        );

        if (currentUser.picture_path)
          await Storage.remove(currentUser.picture_path);
      }

      const person = await prisma.person.update({
        where: { account_id: ctx.userId },
        data: { ...input, picture_path },
        include: { account: { select: { password: false } } },
      });

      if (!person)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be authenticated.",
        });

      return person;
    }),

  /** Update Profile information for a given school. */
  updateSchoolProfile: authenticatedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        city: z.string().optional(),
        country_id: z.number().optional(),
        address_street: z.string().optional(),
        address_number: z.string().optional(),
        address_postal: z.string().optional(),
        is_network: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const school = await prisma.school.update({
        where: { account_id: ctx.userId },
        data: input,
        include: { account: { select: { password: false } } },
      });

      if (!school)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be authenticated.",
        });

      return school;
    }),

  /** Update Account information. */
  updateAccount: authenticatedProcedure
    .input(
      z.object({
        email: z.string().email().optional(),
        password: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const account = await prisma.account.update({
        where: { id: ctx.userId },
        data: {
          ...input,
          password: input.password
            ? await hashPassword(input.password)
            : undefined,
        },
        select: { password: false },
      });

      if (!account)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be authenticated.",
        });

      return account;
    }),
});

export default profilesRouter;
