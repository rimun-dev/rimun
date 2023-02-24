import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Storage from "../storage";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  exclude,
  getCurrentSession,
  getPersonUser,
  getThumbnailImageBuffer,
  hashPassword,
} from "./utils";

const profilesRouter = trpc.router({
  /** Get Profile information for a given person. */
  getPersonProfile: authenticatedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession(ctx);

      const profile = await ctx.prisma.person.findUnique({
        where: { id: input },
        include: {
          account: true,
          country: true,
          applications: {
            where: { session_id: currentSession.id },
            include: {
              requested_group: true,
              requested_role: true,
              confirmed_group: true,
              confirmed_role: true,
            },
            take: 1,
          },
          permissions: { where: { session_id: currentSession.id } },
          guest_matches: {
            where: { session_id: currentSession.id },
            include: { host: true },
            take: 1,
          },
          host_matches: {
            where: { session_id: currentSession.id },
            include: { guest: true },
          },
        },
      });

      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        ...profile,
        account: profile.account
          ? exclude(profile.account, ["password"])
          : null,
      };
    }),

  /** Get Profile information for a given school. */
  getSchoolProfile: authenticatedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession(ctx);

      const profile = await ctx.prisma.school.findUnique({
        where: { id: input },
        include: {
          applications: { where: { session_id: currentSession.id }, take: 1 },
          school_group_assignments: {
            include: { group: true },
            where: { session_id: currentSession.id },
          },
          account: true,
        },
      });

      if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        ...profile,
        account: profile.account
          ? exclude(profile.account, ["password"])
          : null,
      };
    }),

  /** Update Profile information for a given person. */
  updatePersonProfile: authenticatedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        surname: z.string().optional(),
        birthday: z.date().optional(),
        gender: z.enum(["f", "m", "nb"]).nullable().optional(),
        picture: z.string().optional(),
        phone_number: z.string().optional(),
        country_id: z.number().optional(),
        tshirt_size: z.enum(["s", "m", "l", "xl"]).optional(),
        allergies: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession(ctx);
      const currentUser = await getPersonUser(ctx);

      let picture_path = currentUser.picture_path;
      if (input.picture) {
        const picture = await getThumbnailImageBuffer(input.picture);
        picture_path = await Storage.upload(
          picture.data,
          picture.type,
          "img/profile"
        );

        await Storage.remove(currentUser.picture_path);
      }

      const profile = await ctx.prisma.person.update({
        where: { account_id: ctx.userId },
        data: { ...input, picture_path },
        include: {
          applications: { where: { session_id: currentSession.id } },
          account: true,
        },
      });

      if (!profile)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be authenticated.",
        });

      return {
        ...profile,
        account: profile.account
          ? exclude(profile.account, ["password"])
          : null,
      };
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
      const currentSession = await getCurrentSession(ctx);

      const profile = await ctx.prisma.school.update({
        where: { account_id: ctx.userId },
        data: input,
        include: {
          applications: { where: { session_id: currentSession.id } },
          school_group_assignments: {
            include: { group: true },
            where: { session_id: currentSession.id },
          },
          account: true,
        },
      });

      if (!profile)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be authenticated.",
        });

      return {
        ...profile,
        account: exclude(profile.account, ["password"]),
      };
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
      const account = await ctx.prisma.account.update({
        where: { id: ctx.userId },
        data: {
          ...input,
          password: input.password
            ? await hashPassword(input.password)
            : undefined,
        },
      });

      if (!account)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be authenticated.",
        });

      return exclude(account, ["password"]);
    }),

  /**
   * Utility method to call for currently logged in user information.
   */
  getCurrentPersonUser: authenticatedProcedure.query(async ({ ctx }) => {
    const currentSession = await getCurrentSession(ctx);

    const profile = await ctx.prisma.person.findUnique({
      where: { account_id: ctx.userId },
      include: {
        account: true,
        country: true,
        applications: {
          where: { session_id: currentSession.id },
          include: {
            requested_group: true,
            requested_role: true,
            confirmed_group: true,
            confirmed_role: true,
          },
          take: 1,
        },
        permissions: { where: { session_id: currentSession.id } },
        guest_matches: {
          where: { session_id: currentSession.id },
          include: { host: true },
          take: 1,
        },
        host_matches: {
          where: { session_id: currentSession.id },
          include: { guest: true },
        },
      },
    });

    if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

    return {
      ...profile,
      account: profile.account ? exclude(profile.account, ["password"]) : null,
    };
  }),

  /**
   * Utility method to call for currently logged in user information.
   */
  getCurrentSchoolUser: authenticatedProcedure.query(async ({ ctx }) => {
    const currentSession = await getCurrentSession(ctx);

    const profile = await ctx.prisma.school.findUnique({
      where: { account_id: ctx.userId },
      include: {
        applications: { where: { session_id: currentSession.id }, take: 1 },
        school_group_assignments: {
          include: { group: true },
          where: { session_id: currentSession.id },
        },
        account: true,
      },
    });

    if (!profile) throw new TRPCError({ code: "NOT_FOUND" });

    return {
      ...profile,
      account: profile.account ? exclude(profile.account, ["password"]) : null,
    };
  }),
});

export default profilesRouter;
