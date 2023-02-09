import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
});
