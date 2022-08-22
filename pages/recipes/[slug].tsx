import { GetServerSideProps } from "next";
import { z } from "zod";
import { ComponentProps } from "react";
import { RecipePage } from "@/components/RecipePage";
import { prismaClient } from "@/lib/prisma";
import { RecipeSchema } from "@/lib/types";

const QuerySchema = z.object({ slug: z.string().min(1) });

type QuerySchema = z.infer<typeof QuerySchema>;

export default RecipePage;

export const getServerSideProps: GetServerSideProps<
  ComponentProps<typeof RecipePage>
> = async (context) => {
  const { slug } = QuerySchema.parse(context.query);

  const recipe = RecipeSchema.parse(
    await prismaClient.recipe.findUnique({
      rejectOnNotFound: true,
      where: { slug },
    })
  );

  return { props: { ...recipe } };
};
