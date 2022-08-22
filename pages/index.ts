import { GetServerSideProps } from "next";
import { ComponentProps } from "react";
import { RecipesPage } from "@/components/RecipesPage";
import { prismaClient } from "@/lib/prisma";

export default RecipesPage;

export const getServerSideProps: GetServerSideProps<
  ComponentProps<typeof RecipesPage>
> = async (context) => {
  const recipes = await prismaClient.recipe.findMany({
    select: { id: true, slug: true, title: true },
    orderBy: { title: "asc" },
  });

  return { props: { recipes } };
};
