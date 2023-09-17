import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const divisionRouter = router({

    updateNumBreakingPool: protectedProcedure.input(z.object({ divisionId: z.number(), numBreaking: z.number()})).mutation(async ({input, ctx}) =>{
        const updatedDivision = await ctx.prisma.division.update({
            where: {divisionId: input.divisionId},
            data: {numBreakingPool: input.numBreaking}
        })
        return updatedDivision
    }),
    allowWildCards: protectedProcedure.input(z.object({ divisionId: z.number()})).mutation(async ({input, ctx}) =>{
        const updatedDivision = await ctx.prisma.division.update({
            where: {divisionId: input.divisionId},
            data: {hasWildcards: true, numWildcards: 2}
        })
        return updatedDivision
    }),
})