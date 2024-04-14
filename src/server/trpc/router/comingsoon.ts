import { publicProcedure, router } from "../trpc";
import { z } from "zod";
export const comingSoonRouter = router({
  subscribeToUpdates: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const emailValidator = z
        .string()
        .email({ message: "Invalid Email Address" });
      const emailValidated = emailValidator.parse(input.email);
      if (emailValidated) {
        const updateEmailInDB = await ctx.prisma.comingSoonSubscriptions.create(
          {
            data: {
              email: emailValidated,
            },
          },
        );
        return {updateEmailInDB}
      }
    }),
});
