import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { adminRouter } from "./routers/admin";
import { roleRouter } from "./routers/roles";
import { tournamentDirectorRouter } from "./routers/tournament/director";
import { tournamentBasicRouter } from "./routers/tournament/basic";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  role: roleRouter,
  director: tournamentDirectorRouter,
  tournamentBasic: tournamentBasicRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
