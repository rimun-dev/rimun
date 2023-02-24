import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authenticatedProcedure, trpc } from "../trpc";
import {
  checkPersonPermission,
  getCurrentSession,
  getPersonUser,
} from "./utils";

const newsRouter = trpc.router({
  /** Retrieve all posts for the current session. */
  getPosts: trpc.procedure.query(async ({ ctx }) => {
    const currentSession = await getCurrentSession(ctx);
    return await ctx.prisma.post.findMany({
      where: { session_id: currentSession.id },
      include: {
        author: {
          include: {
            account: true,
            applications: {
              where: { session_id: currentSession.id },
              include: {
                confirmed_role: true,
                confirmed_group: true,
              },
              take: 1,
            },
          },
        },
      },
    });
  }),

  /** Create a post for the current session. */
  createPost: authenticatedProcedure
    .input(
      z.object({
        title: z.string(),
        body: z.string(),
        is_for_persons: z.boolean(),
        is_for_schools: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, {
        resourceName: "news",
        userGroupName: "secretariat",
      });

      const currentUser = await getPersonUser(ctx);

      const currentSession = await getCurrentSession(ctx);

      return await ctx.prisma.post.create({
        data: {
          ...input,
          author_id: currentUser.id,
          session_id: currentSession.id,
        },
      });
    }),

  /** Update a post (regardless of the original author). */
  updatePost: authenticatedProcedure
    .input(
      z.object({
        post_id: z.number(),
        title: z.string().optional(),
        body: z.string().optional(),
        is_for_persons: z.boolean().optional(),
        is_for_schools: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, {
        resourceName: "news",
        userGroupName: "secretariat",
      });

      const post = await ctx.prisma.post.update({
        where: { id: input.post_id },
        data: input,
      });

      if (!post)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This post does not exist.",
        });

      return post;
    }),

  /** Delete a post (regardless of the original author). */
  deletePost: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await checkPersonPermission(ctx, {
        resourceName: "news",
        userGroupName: "secretariat",
      });

      const post = await ctx.prisma.post.delete({
        where: { id: input },
      });

      if (!post)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This post does not exist.",
        });
    }),
});

export default newsRouter;
