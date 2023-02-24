import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  checkPersonPermission,
  getCurrentSession,
  getGroup,
  identifierSchema,
} from "./utils";

const teamRouter = trpc.router({
  /** Add a person to the Secretariat core team. */
  addTeamMember: authenticatedProcedure
    .input(
      z.object({
        person_id: z.number(),
        confirmed_role_id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "team" });

      const currentSession = await getCurrentSession(ctx);

      const application = await ctx.prisma.personApplication.findUnique({
        where: {
          person_id_session_id: {
            person_id: input.person_id,
            session_id: currentSession.id,
          },
        },
      });

      const secretariatGroup = await getGroup("secretariat", ctx);

      if (!application)
        await ctx.prisma.personApplication.create({
          data: {
            person_id: input.person_id,
            session_id: currentSession.id,
            requested_group_id: secretariatGroup.id,
            confirmed_group_id: secretariatGroup.id,
            requested_role_id: input.confirmed_role_id,
            confirmed_role_id: input.confirmed_role_id,
            status_application: "ACCEPTED",
            status_housing: "NOT_REQUIRED",
          },
        });
      else
        await ctx.prisma.personApplication.update({
          where: {
            person_id_session_id: {
              person_id: input.person_id,
              session_id: currentSession.id,
            },
          },
          data: {
            requested_group_id: secretariatGroup.id,
            confirmed_group_id: secretariatGroup.id,
            requested_role_id: input.confirmed_role_id,
            confirmed_role_id: input.confirmed_role_id,
            status_application: "ACCEPTED",
            status_housing: "NOT_REQUIRED",
          },
        });
    }),

  /** Remove a person from the Secretariat core team. */
  removeTeamMember: authenticatedProcedure
    .input(identifierSchema)
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "team" });

      const currentSession = await getCurrentSession(ctx);
      const secretariatGroup = await getGroup("secretariat", ctx);

      const application = await ctx.prisma.personApplication.findUnique({
        where: {
          person_id_session_id: {
            person_id: input,
            session_id: currentSession.id,
          },
        },
      });

      if (
        !application ||
        application.confirmed_group_id !== secretariatGroup.id
      )
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This person is not a member of the Secretariat.",
        });

      await ctx.prisma.personApplication.delete({
        where: {
          person_id_session_id: {
            person_id: input,
            session_id: currentSession.id,
          },
        },
      });
    }),

  /** Retrieve all permissions and relative team members. */
  getAllPermissions: authenticatedProcedure.query(async ({ ctx }) => {
    await checkPersonPermission(ctx, { resourceName: "team" });

    const currentSession = await getCurrentSession(ctx);

    return await ctx.prisma.resource.findMany({
      include: {
        permissions: {
          where: { session_id: currentSession.id },
          include: { person: true, resource: true },
        },
      },
    });
  }),

  /** Grant permission to a single resource to a person. */
  grantPermission: authenticatedProcedure
    .input(
      z.object({
        person_id: z.number(),
        resource_id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "team" });

      const currentSession = await getCurrentSession(ctx);

      const existingPermission = await ctx.prisma.permission.findUnique({
        where: {
          person_id_session_id_resource_id: {
            person_id: input.person_id,
            resource_id: input.resource_id,
            session_id: currentSession.id,
          },
        },
      });

      if (existingPermission) return existingPermission;

      return await ctx.prisma.permission.create({
        data: {
          person_id: input.person_id,
          resource_id: input.resource_id,
          session_id: currentSession.id,
        },
      });
    }),

  /** Revoke permission to a single resource from a person. */
  revokePermission: authenticatedProcedure
    .input(
      z.object({
        person_id: z.number(),
        resource_id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "team" });

      const currentSession = await getCurrentSession(ctx);

      await ctx.prisma.permission.delete({
        where: {
          person_id_session_id_resource_id: {
            person_id: input.person_id,
            resource_id: input.resource_id,
            session_id: currentSession.id,
          },
        },
      });
    }),
});

export default teamRouter;
