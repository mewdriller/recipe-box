import { zodResolver } from "@hookform/resolvers/zod";
import { Recipe } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import { Controller, useForm } from "react-hook-form";
import axios from "redaxios";
import { z } from "zod";
import { container, field, recipeInput, stack } from "./CreateRecipePage.css";

const RecipeFields = z.object({
  ingredients: z.string().min(1),
  title: z.string().min(1),
});

type RecipeFields = z.infer<typeof RecipeFields>;

export const CreateRecipePage: NextPage = () => {
  const {
    control,
    formState: { isValid },
    getValues,
    handleSubmit,
    register,
  } = useForm<RecipeFields>({
    defaultValues: {
      ingredients: "",
      title: "",
    },
    mode: "onChange",
    resolver: zodResolver(RecipeFields),
  });

  // TODO: Improve typing of useQuery data.
  const { data, refetch } = useQuery(
    ["nutrition-data", getValues()],
    async () => {
      const values = getValues();

      const { data } = await axios.post<Recipe>("/api/nutrition-details", {
        ...values,
        ingredients: values.ingredients.split("\n"),
      });

      return data;
    },
    { enabled: false }
  );

  return (
    <main>
      <form
        className={container}
        onSubmit={handleSubmit(() => {
          refetch();
        })}
      >
        <label className={field}>
          Title
          <input {...register("title")} />
        </label>
        <label className={field}>
          Ingredients
          <Controller
            control={control}
            name="ingredients"
            render={({ field }) => (
              <textarea
                {...field}
                className={recipeInput}
                onChange={(event) => {
                  if (
                    (event.nativeEvent as InputEvent).inputType !==
                    "insertFromPaste"
                  ) {
                    field.onChange(event.target.value);
                  }
                }}
                onPaste={(event) => {
                  if (event.clipboardData.types.includes("text/html")) {
                    const node = document.createElement("div");
                    node.innerHTML = event.clipboardData
                      .getData("text/html")
                      .trim();

                    field.onChange(
                      Array.from(node.querySelectorAll("li"))
                        .map((li) =>
                          Array.from(li.children)
                            .map((span) => span.textContent)
                            .filter(Boolean)
                            .join(" ")
                        )
                        .join("\n")
                    );
                  } else if (event.clipboardData.types.includes("text/plain")) {
                    field.onChange(event.clipboardData.getData("text/plain"));
                  }
                }}
              />
            )}
          />
        </label>
        <button
          disabled={!isValid}
          onClick={() => {
            refetch();
          }}
        >
          Analyze
        </button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </form>
    </main>
  );
};
