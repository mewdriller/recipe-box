import { z } from "zod";

const NutrientsSchema = z.object({}).catchall(
  z.object({
    label: z.string().min(0),
    quantity: z.number().min(0),
    unit: z.string().min(0),
  })
);

export const RecipeSchema = z.object({
  ingredients: z.array(z.string().min(1)).min(1),
  nutrition: z.object({
    calories: z.number().min(0),
    totalDaily: NutrientsSchema,
    totalNutrients: NutrientsSchema,
    totalNutrientsKCal: NutrientsSchema,
  }),
  servings: z.array(z.number().int().min(1)).min(1).max(2),
  slug: z.string().min(1),
  title: z.string().min(1),
});

export type Recipe = z.infer<typeof RecipeSchema>;
