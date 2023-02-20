import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../database";
import { authenticatedProcedure, trpc } from "../trpc";
import { checkPersonPermission, getCurrentSession, getGroup } from "./utils";

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
      await checkPersonPermission(ctx.userId, { resourceName: "team" });

      const currentSession = await getCurrentSession();

      const application = await prisma.personApplication.findUnique({
        where: {
          person_id_session_id: {
            person_id: input.person_id,
            session_id: currentSession.id,
          },
        },
      });

      const secretariatGroup = await getGroup("secretariat");

      if (!application)
        await prisma.personApplication.create({
          data: {
            requested_group_id: secretariatGroup.id,
            confirmed_group_id: secretariatGroup.id,
            requested_role_id: input.confirmed_role_id,
            confirmed_role_id: input.confirmed_role_id,
            status_application: "ACCEPTED",
            status_housing: "NOT_REQUIRED",
          },
        });
      else
        await prisma.personApplication.update({
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
    .input(z.object({ person_id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx.userId, { resourceName: "team" });

      const currentSession = await getCurrentSession();
      const secretariatGroup = await getGroup("secretariat");

      const application = await prisma.personApplication.findUnique({
        where: {
          person_id_session_id: {
            person_id: input.person_id,
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

      await prisma.personApplication.delete({
        where: {
          person_id_session_id: {
            person_id: input.person_id,
            session_id: currentSession.id,
          },
        },
      });
    }),

  /** Retrieve all permissions and relative team members. */
  getAllPermissions: authenticatedProcedure.query(async ({ ctx }) => {
    await checkPersonPermission(ctx.userId, { resourceName: "team" });

    const currentSession = await getCurrentSession();

    const resources = await prisma.resource.findMany();
    const permissions = await prisma.permission.findMany({
      where: { session_id: currentSession.id },
    });
    const persons = await prisma.person.findMany({
      where: { id: { in: permissions.map((p) => p.id) } },
    });

    return { resources, permissions, persons };
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
      await checkPersonPermission(ctx.userId, { resourceName: "team" });

      const currentSession = await getCurrentSession();

      const existingPermission = await prisma.permission.findUnique({
        where: {
          person_id_session_id_resource_id: {
            person_id: input.person_id,
            resource_id: input.resource_id,
            session_id: currentSession.id,
          },
        },
      });

      if (existingPermission) return existingPermission;

      return await prisma.permission.create({
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
      await checkPersonPermission(ctx.userId, { resourceName: "team" });

      const currentSession = await getCurrentSession();

      await prisma.permission.delete({
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
