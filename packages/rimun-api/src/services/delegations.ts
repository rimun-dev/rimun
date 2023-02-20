import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../database";
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
      await checkPersonPermission(ctx.userId, { resourceName: "delegation" });

      const currentSession = await getCurrentSession();

      return await prisma.delegation.create({
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
      await checkPersonPermission(ctx.userId, { resourceName: "delegation" });

      await prisma.personApplication.updateMany({
        where: { delegation_id: input },
        data: {
          delegation_id: null,
          committee_id: null,
          is_ambassador: false,
        },
      });

      const delegation = await prisma.delegation.delete({
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
      await checkPersonPermission(ctx.userId, { resourceName: "delegation" });
      return await prisma.delegation.findUnique({
        where: { id: input },
        include: {
          school: true,
          person_applications: { include: { person: true } },
          delegation_committee_assignments: { include: { committee: true } },
        },
      });
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
        ctx.userId,
        input.person_id,
        "delegation"
      );

      const currentSession = await getCurrentSession();

      await prisma.personApplication.update({
        where: {
          person_id_session_id: {
            person_id: input.person_id,
            session_id: currentSession.id,
          },
        },
        data: input,
      });
    }),

  /**
   * Remove delegate from delegation and assigned committee.
   * Both team members and school accounts are allowed to use this procedure.
   */
  removeDelegate: authenticatedProcedure
    .input(identifierSchema)
    .mutation(async ({ input, ctx }) => {
      await checkUserPermissionToUpdatePersonApplication(
        ctx.userId,
        input,
        "delegation"
      );

      const currentSession = await getCurrentSession();

      await prisma.personApplication.update({
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
      await checkPersonPermission(ctx.userId, { resourceName: "delegation" });
      return await prisma.delegation.findMany({
        where: input,
        include: {
          school: true,
          person_applications: { include: { person: true } },
          delegation_committee_assignments: { include: { committee: true } },
        },
      });
    }),
});

export default delegationsRouter;
