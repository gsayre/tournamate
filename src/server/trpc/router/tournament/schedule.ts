import { z } from "zod";
import { protectedProcedure, router } from "../../trpc"

export const scheduleRouter = router({
  getPoolScheudule: protectedProcedure
    .input(z.object({ poolId: z.string()}))
    .query(async ({ ctx, input }) => {
      const poolSchedule = await ctx.prisma.pool.findUnique({
        where: {
          poolId: input.poolId
        },
        include: {
          games: {
            orderBy: {
              gameOrder: "asc",
            },
            include: {
              teams: {
                include: {
                  Team: {
                    include: {
                      players: {
                        include: {
                          user: true,
                        },
                      },
                    },
                  },
                },
              },
              referees: {
                include: {
                  players: {
                    include: {
                      user: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return {
        poolSchedule,
        firstName: ctx.user.firstName,
        lastName: ctx.user.lastName,
      };
    }),
});