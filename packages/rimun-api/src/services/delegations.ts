import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  checkPersonPermission,
  checkUserPermissionToUpdatePersonApplication,
  getCurrentSession,
  identifierSchema,
} from "./utils";

const delegationsRouter = trpc.router({
  /** Create a delegation for the current session. */
  createDelegation: authenticatedProcedure
    .input(
      z
        .union([
          z.object({
            type: z.enum(["ngo", "igo", "historical-country"]),
            name: z.string(),
          }),
          z.object({
            type: z.literal("country"),
            country_id: identifierSchema,
          }),
        ])
        .and(
          z.object({
            n_delegates: z.number().int().min(1),
            is_individual: z.boolean(),
          })
        )
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "delegation" });

      const currentSession = await getCurrentSession(ctx);

      return await ctx.prisma.delegation.create({
        data: {
          ...input,
          session_id: currentSession.id,
        },
      });
    }),

  /** Delete a delegation. */
  deleteDelegation: authenticatedProcedure
    .input(identifierSchema)
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "delegation" });

      await ctx.prisma.personApplication.updateMany({
        where: { delegation_id: input },
        data: {
          delegation_id: null,
          committee_id: null,
          is_ambassador: false,
        },
      });

      const delegation = await ctx.prisma.delegation.delete({
        where: { id: input },
      });

      if (!delegation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This delegation does not exist.",
        });
    }),

  /** Retrieve delegation information. */
  getDelegation: authenticatedProcedure
    .input(identifierSchema)
    .query(async ({ input, ctx }) => {
      const delegation = await ctx.prisma.delegation.findUnique({
        where: { id: input },
        include: {
          school: { include: { country: true } },
          country: true,
          person_applications: { include: { person: true } },
          delegation_committee_assignments: {
            include: { committee: { include: { forum: true } } },
          },
        },
      });

      if (!delegation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This delegation does not exist.",
        });

      return delegation;
    }),

  /**
   * Add delegate to delegation assigning them to a specific committee.
   * Both team members and school accounts are allowed to use this procedure.
   */
  addDelegate: authenticatedProcedure
    .input(
      z.object({
        person_id: identifierSchema,
        delegation_id: identifierSchema,
        is_ambassador: z.boolean(),
        committee_id: identifierSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkUserPermissionToUpdatePersonApplication(
        ctx,
        input.person_id,
        "delegation"
      );

      const currentSession = await getCurrentSession(ctx);

      await ctx.prisma.$transaction([
        ctx.prisma.personApplication.updateMany({
          where: {
            committee_id: input.committee_id,
            session_id: currentSession.id,
            delegation_id: input.delegation_id,
          },
          data: { committee_id: null },
        }),
        ctx.prisma.personApplication.update({
          where: {
            person_id_session_id: {
              person_id: input.person_id,
              session_id: currentSession.id,
            },
          },
          data: input,
        }),
      ]);
    }),

  /**
   * Remove delegate from delegation and assigned committee.
   * Both team members and school accounts are allowed to use this procedure.
   */
  removeDelegate: authenticatedProcedure
    .input(identifierSchema)
    .mutation(async ({ input, ctx }) => {
      await checkUserPermissionToUpdatePersonApplication(
        ctx,
        input,
        "delegation"
      );

      const currentSession = await getCurrentSession(ctx);

      await ctx.prisma.personApplication.update({
        where: {
          person_id_session_id: {
            person_id: input,
            session_id: currentSession.id,
          },
        },
        data: {
          delegation_id: null,
          committee_id: null,
          is_ambassador: false,
        },
      });
    }),

  /** Retrieve delegation information. */
  getDelegations: authenticatedProcedure
    .input(
      z.object({
        school_id: identifierSchema.optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const currentSession = await getCurrentSession(ctx);

      return await ctx.prisma.delegation.findMany({
        where: { ...input, session_id: currentSession.id },
        include: {
          school: true,
          country: true,
          person_applications: { include: { person: true } },
          delegation_committee_assignments: { include: { committee: true } },
        },
      });
    }),

  /** Assign committee to delegation. */
  assignCommittee: authenticatedProcedure
    .input(
      z.object({
        committee_id: identifierSchema,
        delegation_id: identifierSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "delegation" });

      const delegation = await ctx.prisma.delegation.findUnique({
        where: { id: input.delegation_id },
      });

      if (!delegation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This delegation does not exist.",
        });

      const committee = await ctx.prisma.committee.findUnique({
        where: { id: input.committee_id },
      });

      if (!committee)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This committee does not exist.",
        });

      const currentSession = await getCurrentSession(ctx);

      await ctx.prisma.delegationCommitteeAssignment.create({
        data: {
          ...input,
          session_id: currentSession.id,
        },
      });
    }),

  /** Remove committee from delegation. */
  removeCommittee: authenticatedProcedure
    .input(
      z.object({
        committee_id: identifierSchema,
        delegation_id: identifierSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "delegation" });

      const delegation = await ctx.prisma.delegation.findUnique({
        where: { id: input.delegation_id },
      });

      if (!delegation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This delegation does not exist.",
        });

      const currentSession = await getCurrentSession(ctx);

      await ctx.prisma.delegationCommitteeAssignment.delete({
        where: {
          delegation_id_committee_id_session_id: {
            ...input,
            session_id: currentSession.id,
          },
        },
      });
    }),

  /** Assign school to delegation. */
  assignSchool: authenticatedProcedure
    .input(
      z.object({
        school_id: identifierSchema,
        delegation_id: identifierSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "delegation" });

      const delegation = await ctx.prisma.delegation.findUnique({
        where: { id: input.delegation_id },
      });

      if (!delegation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This delegation does not exist.",
        });

      const school = await ctx.prisma.school.findUnique({
        where: { id: input.school_id },
      });

      if (!school)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This school does not exist.",
        });

      return await ctx.prisma.delegation.update({
        where: { id: delegation.id },
        data: { school_id: input.school_id },
      });
    }),

  /** Remove school from delegation. */
  removeSchool: authenticatedProcedure
    .input(identifierSchema)
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "delegation" });

      const delegation = await ctx.prisma.delegation.findUnique({
        where: { id: input },
      });

      if (!delegation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This delegation does not exist.",
        });

      return await ctx.prisma.delegation.update({
        where: { id: delegation.id },
        data: { school_id: null },
      });
    }),
});

export default delegationsRouter;
