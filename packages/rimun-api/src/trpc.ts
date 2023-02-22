import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import superjson from "superjson";
import { extractUserIdentityFromRequest } from "./authn";
import { prisma } from "./database";

export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  const identityPayload = await extractUserIdentityFromRequest(req, res);
  return {
    userId: identityPayload?.sub ? Number.parseInt(identityPayload.sub) : null,
    prisma,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

export const trpc = initTRPC
  .context<Context>()
  .create({ transformer: superjson });

export const trpcProcedure = trpc.procedure;

const isAuthenticated = trpc.middleware(async ({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { userId: ctx.userId } });
});

export const authenticatedProcedure = trpcProcedure.use(isAuthenticated);
