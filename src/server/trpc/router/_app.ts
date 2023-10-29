// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { tournamentRouter } from "./tournament/tournament";
import { divisionRouter } from "./tournament/division";
import { scheduleRouter } from "./tournament/schedule";
import { bracketRouter } from "./tournament/bracket";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  tournament: tournamentRouter,
  division: divisionRouter,
  schedule: scheduleRouter,
  bracket: bracketRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
