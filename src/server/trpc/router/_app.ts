// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { tournamentRouter } from "./tournament";
import { divisionRouter } from "./division";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  tournament: tournamentRouter,
  division: divisionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
