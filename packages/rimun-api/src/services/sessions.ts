import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  checkPersonPermission,
  getGroup,
  getRole,
  identifierSchema,
} from "./utils";

const sessionsRouter = trpc.router({
  getAllSessions: trpc.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.session.findMany();
  }),

  /** Creates a new session and grants all privileges to the SG. */
  createSession: authenticatedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        edition_display: z.number().int(),
        is_active: z.boolean(),
        date_start: z.date().optional(),
        date_end: z.date().optional(),
        secretary_general_id: identifierSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkPersonPermission(ctx, { userGroupName: "secretariat" });

      const { secretary_general_id, ...data } = input;

      if (input.is_active) {
        await ctx.prisma.session.updateMany({
          where: { is_active: true },
          data: { is_active: false },
        });
      }

      const existingEdition = await ctx.prisma.session.findFirst({
        where: { edition_display: data.edition_display },
      });
      if (!!existingEdition)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This edition already exists.",
        });

      const session = await ctx.prisma.session.create({
        data: { ...data, edition: data.edition_display },
      });

      const secretary_general_account_id = (
        await ctx.prisma.person.findUnique({
          where: { id: secretary_general_id },
        })
      )?.account_id;

      if (!secretary_general_account_id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "The selected SG does not exist.",
        });

      const secretariatGroup = await getGroup("secretariat", ctx);
      const resources = await ctx.prisma.resource.findMany();

      await ctx.prisma.$transaction([
        ctx.prisma.personApplication.create({
          data: {
            person_id: secretary_general_id,
            session_id: session.id,
            status_application: "ACCEPTED",
            status_housing: "NOT_REQUIRED",
            confirmed_group_id: secretariatGroup.id,
            confirmed_role_id: (
              await getRole("Secretary General", secretariatGroup.id, ctx)
            ).id,
          },
        }),
        ctx.prisma.account.update({
          where: { id: secretary_general_account_id },
          data: { is_admin: true },
        }),
        ...resources.map((r) =>
          ctx.prisma.permission.create({
            data: {
              person_id: secretary_general_id,
              resource_id: r.id,
              session_id: session.id,
            },
          })
        ),
      ]);

      return session;
    }),

  /** Updates session's information. */
  updateSession: authenticatedProcedure
    .input(
      z.object({
        id: identifierSchema,
        title: z.string().optional(),
        description: z.string().optional(),
        edition_display: z.number().int().optional(),
        is_active: z.boolean().optional(),
        date_start: z.date().optional(),
        date_end: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await checkPersonPermission(ctx, { userGroupName: "secretariat" });

      if (input.is_active) {
        await ctx.prisma.session.updateMany({
          where: { is_active: true },
          data: { is_active: false },
        });
      }

      const existingEdition = await ctx.prisma.session.findFirst({
        where: {
          edition_display: input.edition_display,
          NOT: { id: input.id },
        },
      });
      if (!!existingEdition)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This edition already exists.",
        });

      return await ctx.prisma.session.update({
        where: { id: input.id },
        data: input,
      });
    }),
});

export default sessionsRouter;
