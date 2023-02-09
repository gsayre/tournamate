// src/server/router/context.ts
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "../db/client";
import { clerkClient, User} from "@clerk/nextjs/api"
import { getAuth } from "@clerk/nextjs/server";

type IUserProps = {
  user: User | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async ({user}: IUserProps) => {
  return {
    user,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  async function getUser() {
    const { userId } = getAuth(opts.req)
    const user = userId ? await clerkClient.users.getUser(userId) : null
    return user
  }
  const user = await getUser()
  return await createContextInner({
    user,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
