import type { TrpcRouter } from "@rimun/api";
import { inferRouterOutputs } from "@trpc/server";

export type RouterOutputs = inferRouterOutputs<TrpcRouter>;

export type SearchRouterOutputs = RouterOutputs["search"];
export type InfoRouterOutputs = RouterOutputs["info"];

export type AttendeeData = Partial<
  SearchRouterOutputs["searchPersons"]["result"][0]
>;
