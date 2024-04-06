import { AppRouter } from "server/trpc/router/_app";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type InferredGetMyPoolType = RouterOutputs["tournament"]["getMyPool"];