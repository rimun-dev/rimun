import { TRPCError } from "@trpc/server";
import { z } from "zod";
import Storage from "../storage";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  checkPersonPermission,
  getCurrentSession,
  getDocumentBuffer,
} from "./utils";

const committeesRouter = trpc.router({
  /** Create committee for the current session. */
  createCommittee: authenticatedProcedure
    .input(
      z.object({
        forum_id: z.number(),
        name: z.string(),
        size: z.number().int(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "committee" });

      const currentSession = await getCurrentSession(ctx);

      return await ctx.prisma.committee.create({
        data: { ...input, session_id: currentSession.id },
      });
    }),

  /** Update existing committee. */
  updateCommittee: authenticatedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        size: z.number().int().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "committee" });

      const committee = await ctx.prisma.committee.update({
        where: { id: input.id },
        data: input,
      });

      if (!committee)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This committee does not exist.",
        });

      return committee;
    }),

  /** Retrieve committee information. */
  getCommittee: authenticatedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "committee" });
      const committee = await ctx.prisma.committee.findUnique({
        where: { id: input },
        include: {
          forum: true,
          delegation_committee_assignments: { include: { delegation: true } },
          person_applications: {
            include: {
              person: true,
              confirmed_role: true,
              confirmed_group: true,
              delegation: { include: { country: true } },
            },
          },
          report: true,
          topics: true,
        },
      });
      if (!committee) throw new TRPCError({ code: "NOT_FOUND" });
      return committee;
    }),

  /** Updated committee report. */
  updateCommitteeReport: authenticatedProcedure
    .input(
      z.object({
        committee_id: z.number(),
        name: z.string(),
        document: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "committee" });

      const committee = await ctx.prisma.committee.findUnique({
        where: { id: input.committee_id },
      });

      if (!committee)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This committee does not exist.",
        });

      const document = getDocumentBuffer(input.document);
      const document_path = await Storage.upload(
        document.data,
        document.type,
        "documents"
      );

      const { document: _, ...data } = input;

      await ctx.prisma.report.deleteMany({
        where: { committee_id: input.committee_id },
      });

      return await ctx.prisma.report.create({
        data: { ...data, document_path },
      });
    }),

  /** Create committee topic. */
  createCommitteeTopic: authenticatedProcedure
    .input(
      z.object({
        committee_id: z.number(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "committee" });

      const committee = await ctx.prisma.committee.findUnique({
        where: { id: input.committee_id },
      });

      if (!committee)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This committee does not exist.",
        });

      return await ctx.prisma.topic.create({ data: input });
    }),

  /** Delete committee topic. */
  deleteCommitteeTopic: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, { resourceName: "committee" });

      const topic = await ctx.prisma.topic.delete({ where: { id: input } });

      if (!topic)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This topic does not exist.",
        });
    }),
});

export default committeesRouter;
