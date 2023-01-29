import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  findUsername: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });
      return user?.name;
    }),
  getUserRoles: protectedProcedure.query(async ({ ctx }) => {
    const userResponse = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
      select: { isAdmin: true, isTournamentDirector: true },
    });
    return userResponse;
  }),
  approveTournamentDirectorRequest: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tdRequest = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { isTournamentDirector: true },
      });
      await ctx.prisma.tournamentDirectorRequest.delete({
        where: { profileId: input.userId },
      });
    }),
  denyTournamentDirectorRequest: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tdRequest = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { isTournamentDirector: false },
      });
      await ctx.prisma.tournamentDirectorRequest.delete({
        where: { profileId: input.userId },
      });
    }),
  createTournamentDirectorRequest: protectedProcedure
    .input(z.object({ userId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tdRequest = await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { tdRequest: { create: { content: input.content } } },
      });
      return tdRequest;
    }),
  getTournamentDirectorRequests: protectedProcedure.query(async ({ ctx }) => {
    const tdRequests = await ctx.prisma.tournamentDirectorRequest.findMany();
    return tdRequests;
  }),

  toggleTournamentDirectorRole: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.userId },
        select: { isTournamentDirector: true },
      });
      if (user) {
        const tdRequest = await ctx.prisma.user.update({
          where: { id: input.userId },
          data: { isTournamentDirector: !user.isTournamentDirector },
        });
        return tdRequest;
      }
      return null;
    }),
  toggleAdminRole: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: input.userId },
        select: { isAdmin: true },
      });
      if (user) {
        const tdRequest = await ctx.prisma.user.update({
          where: { id: input.userId },
          data: { isAdmin: !user.isAdmin },
        });
        return tdRequest;
      }
      return null;
    }),
});
