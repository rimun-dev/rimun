import type { TrpcRouter } from "@rimun/api";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";
import { store } from "./store";

export const trpc = createTRPCReact<TrpcRouter>();

export function createTrpcClient(url: string) {
  return trpc.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url,
        async headers() {
          const authState = store.getState().auth;
          const token = authState.isAuthenticated ? authState.token : undefined;
          return !!token ? { authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });
}

export type ApplicationsRouterInputs =
  inferRouterInputs<TrpcRouter>["applications"];
export type ApplicationsRouterOutputs =
  inferRouterOutputs<TrpcRouter>["applications"];

export type AuthRouterInputs = inferRouterInputs<TrpcRouter>["auth"];
export type AuthRouterOutputs = inferRouterOutputs<TrpcRouter>["auth"];

export type CommitteesRouterInputs =
  inferRouterInputs<TrpcRouter>["committees"];
export type CommitteesRouterOutputs =
  inferRouterOutputs<TrpcRouter>["committees"];

export type DelegationsRouterInputs =
  inferRouterInputs<TrpcRouter>["delegations"];
export type DelegationsRouterOutputs =
  inferRouterOutputs<TrpcRouter>["delegations"];

export type DirectorsRouterInputs = inferRouterInputs<TrpcRouter>["directors"];
export type DirectorsRouterOutputs =
  inferRouterOutputs<TrpcRouter>["directors"];

export type HousingRouterInputs = inferRouterInputs<TrpcRouter>["housing"];
export type HousingRouterOutputs = inferRouterOutputs<TrpcRouter>["housing"];

export type InfoRouterInputs = inferRouterInputs<TrpcRouter>["info"];
export type InfoRouterOutputs = inferRouterOutputs<TrpcRouter>["info"];

export type NewsRouterInputs = inferRouterInputs<TrpcRouter>["news"];
export type NewsRouterOutputs = inferRouterOutputs<TrpcRouter>["news"];

export type ProfilesRouterInputs = inferRouterInputs<TrpcRouter>["profiles"];
export type ProfilesRouterOutputs = inferRouterOutputs<TrpcRouter>["profiles"];

export type RegistrationRouterInputs =
  inferRouterInputs<TrpcRouter>["registration"];
export type RegistrationRouterOutputs =
  inferRouterOutputs<TrpcRouter>["registration"];

export type ResourcesRouterInputs = inferRouterInputs<TrpcRouter>["resources"];
export type ResourcesRouterOutputs =
  inferRouterOutputs<TrpcRouter>["resources"];

export type SearchRouterInputs = inferRouterInputs<TrpcRouter>["search"];
export type SearchRouterOutputs = inferRouterOutputs<TrpcRouter>["search"];

export type TeamRouterInputs = inferRouterInputs<TrpcRouter>["team"];
export type TeamRouterOutputs = inferRouterOutputs<TrpcRouter>["team"];
