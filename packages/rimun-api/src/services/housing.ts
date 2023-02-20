import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../database";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  checkPersonPermission,
  getCurrentSession,
  getGroup,
  getPersonUserFromAccountId,
  identifierSchema,
} from "./utils";

const housingRouter = trpc.router({
  getStats: authenticatedProcedure.query(async ({ ctx }) => {
    await checkPersonPermission(ctx.userId, { resourceName: "housing" });

    const currentSession = await getCurrentSession();
    const hscGroup = await getGroup("hsc");

    const hscRequestsPersonIds = (
      await prisma.personApplication.findMany({
        where: {
          confirmed_group_id: hscGroup.id,
          session_id: currentSession.id,
          status_application: "ACCEPTED",
          status_housing: "ACCEPTED",
        },
        select: { person_id: true },
      })
    ).map((r) => r.person_id!);

    const nMatched = await prisma.housingMatch.count({
      where: { session_id: currentSession.id },
    });

    const nHscMatched = await prisma.housingMatch.count({
      where: {
        session_id: currentSession.id,
        guest_id: { in: hscRequestsPersonIds },
      },
    });

    const nSchoolRequests = await prisma.schoolGroupAssignment.aggregate({
      where: { session_id: currentSession.id, n_confirmed: { not: null } },
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
      const currentUser = await getPersonUserFromAccountId(ctx.userId);

      if (currentUser.id !== input)
        await checkPersonPermission(ctx.userId, { resourceName: "housing" });

      const currentSession = await getCurrentSession();

      return await prisma.housingMatch.findMany({
        where: { session_id: currentSession.id, host_id: input },
      });
    }),

  getGuestHousingMatches: authenticatedProcedure
    .input(identifierSchema)
    .query(async ({ input, ctx }) => {
      const currentUser = await getPersonUserFromAccountId(ctx.userId);

      if (currentUser.id !== input)
        await checkPersonPermission(ctx.userId, { resourceName: "housing" });

      const currentSession = await getCurrentSession();

      return await prisma.housingMatch.findMany({
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
      await checkPersonPermission(ctx.userId, { resourceName: "housing" });

      const currentSession = await getCurrentSession();

      const hostApplication = await prisma.personApplication.findUnique({
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

      const guestApplication = await prisma.personApplication.findUnique({
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

      const existingGuestMatch = await prisma.housingMatch.findFirst({
        where: { guest_id: input.guest_id, session_id: currentSession.id },
      });
      if (existingGuestMatch)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The guest has already been assigned.",
        });

      const nExistingHostMatches = await prisma.housingMatch.count({
        where: { host_id: input.host_id, session_id: currentSession.id },
      });
      if (nExistingHostMatches >= (hostApplication.housing_n_guests ?? 0))
        if (existingGuestMatch)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The host has too many guests already.",
          });

      return await prisma.housingMatch.create({
        data: {
          ...input,
          session_id: currentSession.id,
        },
      });
    }),

  deleteHousingMatch: authenticatedProcedure
    .input(identifierSchema)
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx.userId, { resourceName: "housing" });
      const match = await prisma.housingMatch.delete({ where: { id: input } });
      if (!match)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This match does not exist.",
        });
    }),
});

export default housingRouter;
