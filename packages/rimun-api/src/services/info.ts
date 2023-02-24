import { z } from "zod";
import { trpc } from "../trpc";
import { getCurrentSession, identifierSchema } from "./utils";

const infoRouter = trpc.router({
  getCountries: trpc.procedure.query(
    async ({ ctx }) => await ctx.prisma.country.findMany()
  ),

  getSessions: trpc.procedure.query(
    async ({ ctx }) => await ctx.prisma.session.findMany()
  ),

  getResources: trpc.procedure.query(
    async ({ ctx }) => await ctx.prisma.resource.findMany()
  ),

  getForums: trpc.procedure.query(async ({ ctx }) => {
    const currentSession = await getCurrentSession(ctx);

    const forums = await ctx.prisma.forum.findMany({
      include: { committees: { where: { session_id: currentSession.id } } },
    });

    const committees_stats: { [cid: number]: number } = {};
    for (let f of forums) {
      for (let c of f.committees) {
        committees_stats[c.id] = await ctx.prisma.personApplication.count({
          where: { committee_id: c.id, session_id: currentSession.id },
        });
      }
    }

    return { forums, committees_stats };
  }),

  getGroups: trpc.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.group.findMany();
  }),

  getRoles: trpc.procedure
    .input(
      z
        .object({
          group: z.object({
            name: z.string().optional(),
            id: identifierSchema.optional(),
          }),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.role.findMany({
        where: input,
      });
    }),
});

export default infoRouter;
