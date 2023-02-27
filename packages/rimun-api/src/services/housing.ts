import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  checkPersonPermission,
  getCurrentSession,
  getPersonUser,
  identifierSchema,
} from "./utils";

const housingRouter = trpc.router({
  getStats: authenticatedProcedure.query(async ({ ctx }) => {
    await checkPersonPermission(ctx, { resourceName: "housing" });

    const currentSession = await getCurrentSession(ctx);

    const hscRequestsPersonIds = (
      await ctx.prisma.personApplication.findMany({
        where: {
          confirmed_group: { name: "hsc" },
          session_id: currentSession.id,
          status_application: "ACCEPTED",
          status_housing: "ACCEPTED",
        },
        select: { person_id: true },
      })
    ).map((r) => r.person_id!);

    const nMatched = await ctx.prisma.housingMatch.count({
      where: { session_id: currentSession.id },
    });

    const nHscMatched = await ctx.prisma.housingMatch.count({
      where: {
        session_id: currentSession.id,
        guest_id: { in: hscRequestsPersonIds },
      },
    });

    const nSchoolRequests = await ctx.prisma.schoolGroupAssignment.aggregate({
      where: {
        session_id: currentSession.id,
        school: {
          applications: {
            some: {
              session_id: currentSession.id,
              status_application: "ACCEPTED",
              status_housing: "ACCEPTED",
            },
          },
        },
        n_confirmed: { not: null },
      },
      _sum: { n_confirmed: true },
    });

    return {
      n_hsc_requests: hscRequestsPersonIds.length,
      n_hsc_matched: nHscMatched,
      n_school_requests: nSchoolRequests._sum.n_confirmed ?? 0,
      n_school_matched: nMatched - nHscMatched,
    };
  }),

  getHostHousingMatches: authenticatedProcedure
    .input(identifierSchema)
    .query(async ({ input, ctx }) => {
      const currentUser = await getPersonUser(ctx);

      if (currentUser.id !== input)
        await checkPersonPermission(ctx, { resourceName: "housing" });

      const currentSession = await getCurrentSession(ctx);

      return await ctx.prisma.housingMatch.findMany({
        where: { session_id: currentSession.id, host_id: input },
      });
    }),

  getGuestHousingMatches: authenticatedProcedure
    .input(identifierSchema)
    .query(async ({ input, ctx }) => {
      const currentUser = await getPersonUser(ctx);

      if (currentUser.id !== input)
        await checkPersonPermission(ctx, { resourceName: "housing" });

      const currentSession = await getCurrentSession(ctx);

      return await ctx.prisma.housingMatch.findMany({
        where: { session_id: currentSession.id, guest_id: input },
      });
    }),

  createHousingMatch: authenticatedProcedure
    .input(
      z.object({
        host_id: identifierSchema,
        guest_id: identifierSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "housing" });

      const currentSession = await getCurrentSession(ctx);

      const hostApplication = await ctx.prisma.personApplication.findUnique({
        where: {
          person_id_session_id: {
            person_id: input.host_id,
            session_id: currentSession.id,
          },
        },
      });
      if (!hostApplication)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The host has not applied for this session yet.",
        });

      const guestApplication = await ctx.prisma.personApplication.findUnique({
        where: {
          person_id_session_id: {
            person_id: input.host_id,
            session_id: currentSession.id,
          },
        },
      });
      if (!guestApplication)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The guest has not applied for this session yet.",
        });

      const existingGuestMatch = await ctx.prisma.housingMatch.findFirst({
        where: { guest_id: input.guest_id, session_id: currentSession.id },
      });
      if (existingGuestMatch)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The guest has already been assigned.",
        });

      const nExistingHostMatches = await ctx.prisma.housingMatch.count({
        where: { host_id: input.host_id, session_id: currentSession.id },
      });
      if (nExistingHostMatches >= (hostApplication.housing_n_guests ?? 0))
        if (existingGuestMatch)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The host has too many guests already.",
          });

      return await ctx.prisma.housingMatch.create({
        data: {
          ...input,
          session_id: currentSession.id,
        },
      });
    }),

  deleteHousingMatch: authenticatedProcedure
    .input(identifierSchema)
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "housing" });
      const match = await ctx.prisma.housingMatch.delete({
        where: { id: input },
      });
      if (!match)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This match does not exist.",
        });
    }),
});

export default housingRouter;
