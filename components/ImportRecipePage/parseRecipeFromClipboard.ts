import { type NutritionDetailsRequest } from "pages/api/nutrition-details";

const isNYTRecipe = (html: string): Boolean =>
  [
    "header_recipe-name__",
    "ingredients_recipeYield__",
    "ingredient_ingredient__",
  ].every((className) => html.includes(className));

const parseNYTRecipe = (html: string): NutritionDetailsRequest => {
  const node = document.createElement("div");
  node.innerHTML = html.trim();

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

  return { ingredients, servings, title };
};

export const parseRecipeFromClipboard =
  async (): Promise<NutritionDetailsRequest> => {
    const clipboardData = await navigator.clipboard.read();

    // TODO: Add other parsing methods.

    const clipboardItem = clipboardData.find((item) =>
      item.types.includes("text/html")
    );

    if (clipboardItem) {
      const clipboardBlob = await clipboardItem.getType("text/html");
      const clipboardText = await clipboardBlob.text();

      if (isNYTRecipe(clipboardText)) {
        return parseNYTRecipe(clipboardText);
      }
    }

    throw new Error("Unable to parse clipboard into recipe.");
  };
