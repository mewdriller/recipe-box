import slugify from "@sindresorhus/slugify";
import { createHash } from "crypto";
import { NextApiHandler } from "next";
import { z } from "zod";
import { getNutritionDetails } from "@/lib/edamam-api";
import { prismaClient } from "@/lib/prisma";

const NutritionDetailsRequest = z.object({
  ingredients: z.array(z.string().min(1)).min(1),
  title: z.string().min(1),
});

type NutritionDetailsRequest = z.infer<typeof NutritionDetailsRequest>;

const nutritionDetailsHandler: NextApiHandler = async (req, res) => {
  try {
    const { ingredients, title } = NutritionDetailsRequest.parse(req.body);

    const hash = createHash("sha512")
      .update(ingredients.join("\n"), "utf8")
      .digest("hex");

    const existingRecipe = await prismaClient.recipe.findUnique({
      where: { hash },
    });

    if (existingRecipe) {
      return res.status(200).json(existingRecipe);
    }

    const { data, status } = await getNutritionDetails(ingredients, title);

    if (status === 200) {
      const recipe = await prismaClient.recipe.create({
        data: {
          hash,
          ingredients,
          nutrition: data,
          slug: slugify(title),
          title,
        },
      });

      return res.status(200).json(recipe);
    }
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ message: "Internal Server Error", status: 500 });
  }
};

export default nutritionDetailsHandler;
