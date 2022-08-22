import { zodResolver } from "@hookform/resolvers/zod";
import { Recipe } from "@prisma/client";
import { NextPage } from "next";
import { useFieldArray } from "react-hook-form";
import { useForm } from "react-hook-form";
import axios from "redaxios";
import { z } from "zod";
import { container, field, recipeInput } from "./CreateRecipePage.css";

const RecipeFields = z.object({
  ingredients: z.array(z.object({ value: z.string().min(1) })).min(1),
  servings: z
    .array(z.object({ value: z.number().min(1) }))
    .min(1)
    .max(2),
  title: z.string().min(1),
});

type RecipeFields = z.infer<typeof RecipeFields>;

export const CreateRecipePage: NextPage = () => {
  const {
    control,
    formState: { isValid },
    handleSubmit,
    register,
    reset,
  } = useForm<RecipeFields>({
    defaultValues: {
      ingredients: [],
      servings: [],
      title: "",
    },
    mode: "onChange",
    resolver: zodResolver(RecipeFields),
  });
  const { fields: ingredients } = useFieldArray({
    control,
    name: "ingredients",
  });
  const { fields: servings } = useFieldArray({ control, name: "servings" });

  return (
    <main>
      <form
        className={container}
        onSubmit={handleSubmit(async ({ ingredients, servings, title }) => {
          const { data } = await axios.post<Recipe>("/api/nutrition-details", {
            ingredients: ingredients.map(({ value }) => value),
            servings: servings.map(({ value }) => value),
            title,
          });

          console.log("data", data);
        })}
      >
        <button
          onClick={async () => {
            try {
              const clipboardData = await navigator.clipboard.read();
              const clipboardItem = clipboardData.find((item) =>
                item.types.includes("text/html")
              );

              if (clipboardItem) {
                const clipboardBlob = await clipboardItem.getType("text/html");
                const clipboardText = await clipboardBlob.text();

                const node = document.createElement("div");
                node.innerHTML = clipboardText.trim();

                const title =
                  node.querySelector(
                    'h1[class^="header_recipe-name__"], h1[class*=" header_recipe-name__"]'
                  )?.textContent ?? "";

                const servings = node
                  .querySelector(
                    '[class^="ingredients_recipeYield__"], [class*=" ingredients_recipeYield__"]'
                  )
                  ?.textContent?.match(/\d+/g)
                  ?.map(Number) ?? [1];

                const ingredients = Array.from(
                  node.querySelectorAll(
                    'li[class^="ingredient_ingredient__"], li[class*=" ingredient_ingredient__"]'
                  )
                ).map((li) =>
                  Array.from(li.children)
                    .map((span) => span.textContent)
                    .filter(Boolean)
                    .join(" ")
                );

                reset({
                  ingredients: ingredients.map((value) => ({ value })),
                  servings: servings.map((value) => ({ value })),
                  title,
                });
              }
            } catch (error) {
              console.error("Failed to import recipe.", error);
            }
          }}
        >
          Import recipe from clipboard
        </button>
        <label className={field}>
          Title
          <input {...register("title")} disabled />
        </label>
        <label className={field}>
          Servings
          {servings.map(({ id }, index) => (
            <input {...register(`servings.${index}.value`)} disabled key={id} />
          ))}
        </label>
        <label className={field}>
          Ingredients
          {ingredients.map(({ id }, index) => (
            <input
              {...register(`ingredients.${index}.value`)}
              disabled
              key={id}
            />
          ))}
        </label>
        <button disabled={!isValid} type="submit">
          Analyze recipe
        </button>
      </form>
    </main>
  );
};
