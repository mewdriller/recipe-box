import Link from "next/link";
import { FC } from "react";
import { PageTemplate } from "../PageTemplate";

export const RecipesPage: FC<{
  recipes: Array<{ id: string; slug: string; title: string }>;
}> = ({ recipes }) => {
  return (
    <PageTemplate>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link href={`/recipes/${recipe.slug}`}>{recipe.title}</Link>
          </li>
        ))}
      </ul>
    </PageTemplate>
  );
};
