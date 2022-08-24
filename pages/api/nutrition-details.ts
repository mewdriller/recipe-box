import slugify from "@sindresorhus/slugify";
import { createHash } from "crypto";
import { nanoid } from "nanoid";
import { NextApiHandler } from "next";
import axios from "redaxios";
import { z } from "zod";
import { ENV } from "@/lib/env";
import { prismaClient } from "@/lib/prisma";

const NutritionDetailsRequest = z.object({
  ingredients: z.array(z.string().min(1)).min(1),
  servings: z.array(z.number().min(1)).min(1).max(2),
  title: z.string().min(1),
});

export type NutritionDetailsRequest = z.infer<typeof NutritionDetailsRequest>;

const nutritionDetailsHandler: NextApiHandler = async (req, res) => {
  try {
    const { ingredients, servings, title } = NutritionDetailsRequest.parse(
      req.body
    );

    const hash = createHash("sha512")
      .update(ingredients.join("\n"), "utf8")
      .digest("hex");

    const existingRecipe = await prismaClient.recipe.findUnique({
      where: { hash },
    });

    if (existingRecipe) {
      return res.status(200).json(existingRecipe);
    }

    const nutritionDetailsRes = await axios.post(
      "https://api.edamam.com/api/nutrition-details",
      { ingr: ingredients, title: nanoid() },
      { params: { app_id: ENV.EDAMAM_APP_ID, app_key: ENV.EDAMAM_APP_KEY } }
    );

    if (nutritionDetailsRes.status !== 200) {
      return res
        .status(nutritionDetailsRes.status)
        .json({ message: nutritionDetailsRes.statusText });
    }

    const recipe = await prismaClient.recipe.create({
      data: {
        hash,
        ingredients,
        nutrition: nutritionDetailsRes.data,
        servings,
        slug: slugify(title),
        title,
      },
    });

    return res.status(200).json(recipe);
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ message: "Internal Server Error", status: 500 });
  }
};

export default nutritionDetailsHandler;
