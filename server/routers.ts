import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createOutfitScan, getOutfitScans, getOutfitScanById } from "./db";
import { generateWeatherRecommendations } from "./aiAnalysis";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  outfit: router({
    analyze: protectedProcedure
      .input(z.object({
        imageBase64: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { analyzeOutfitImage } = await import("./aiAnalysis");
        return analyzeOutfitImage(input.imageBase64);
      }),
    create: protectedProcedure
      .input(z.object({
        imageUrl: z.string(),
        detectedItems: z.array(z.string()),
        colorPalette: z.array(z.string()),
        styleScore: z.number().min(1).max(10),
        styleTags: z.array(z.string()),
        weatherCondition: z.string().optional(),
        temperature: z.number().optional(),
        weatherIcon: z.string().optional(),
        recommendations: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        let recommendations = input.recommendations;
        if (!recommendations || recommendations.length === 0) {
          recommendations = await generateWeatherRecommendations(
            input.detectedItems,
            input.styleTags,
            input.weatherCondition || null,
            input.temperature || null
          );
        }

        return createOutfitScan({
          userId: ctx.user.id,
          imageUrl: input.imageUrl,
          detectedItems: JSON.stringify(input.detectedItems),
          colorPalette: JSON.stringify(input.colorPalette),
          styleScore: input.styleScore,
          styleTags: JSON.stringify(input.styleTags),
          weatherCondition: input.weatherCondition || null,
          temperature: input.temperature || null,
          weatherIcon: input.weatherIcon || null,
          recommendations: recommendations && recommendations.length > 0 ? JSON.stringify(recommendations) : null,
        });
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      const scans = await getOutfitScans(ctx.user.id);
      return scans.map(scan => ({
        ...scan,
        detectedItems: JSON.parse(scan.detectedItems),
        colorPalette: JSON.parse(scan.colorPalette),
        styleTags: JSON.parse(scan.styleTags),
        recommendations: scan.recommendations ? JSON.parse(scan.recommendations) : [],
      }));
    }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const scan = await getOutfitScanById(input.id);
        if (!scan || scan.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        return {
          ...scan,
          detectedItems: JSON.parse(scan.detectedItems),
          colorPalette: JSON.parse(scan.colorPalette),
          styleTags: JSON.parse(scan.styleTags),
          recommendations: scan.recommendations ? JSON.parse(scan.recommendations) : [],
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Re-export for convenience
export { createOutfitScan, getOutfitScans, getOutfitScanById } from "./db";
