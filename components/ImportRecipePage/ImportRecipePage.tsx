import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddCircleOutline as AddCircleOutlineIcon,
  ContentPasteGo as ContentPasteGoIcon,
  RemoveCircle as RemoveCircleIcon,
  SaveOutlined as SaveOutlinedIcon,
} from "@mui/icons-material";
import {
  Button,
  Container,
  IconButton,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Recipe } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Controller, useFieldArray } from "react-hook-form";
import { useForm } from "react-hook-form";
import axios from "redaxios";
import { z } from "zod";
import { PageTemplate } from "../PageTemplate";
import { parseRecipeFromClipboard } from "./parseRecipeFromClipboard";

const FormFields = z.object({
  ingredients: z.array(z.object({ value: z.string().min(1) })).min(1),
  servings: z
    .array(z.object({ value: z.number().min(1) }))
    .min(1)
    .max(2),
  title: z.string().min(1),
});

type FormFields = z.infer<typeof FormFields>;

export const ImportRecipePage: NextPage = () => {
  const router = useRouter();
  const {
    control,
    formState: { isValid },
    handleSubmit,
    reset,
  } = useForm<FormFields>({
    defaultValues: {
      ingredients: [{ value: "" }],
      servings: [{ value: 1 }, { value: 1 }],
      title: "",
    },
    mode: "onChange",
    resolver: zodResolver(FormFields),
  });
  const ingredientsFieldArray = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <PageTemplate>
      <Container>
        <Paper component={Stack} direction="column" gap={2} m={2} p={2}>
          <Typography component="h1" gutterBottom variant="h4">
            Import recipe
          </Typography>
          <Stack
            component="form"
            direction="column"
            gap={2}
            onSubmit={handleSubmit(async ({ ingredients, servings, title }) => {
              const { data } = await axios.post<Recipe>(
                "/api/nutrition-details",
                {
                  ingredients: ingredients.map(({ value }) => value),
                  servings: Array.from(
                    new Set(servings.map(({ value }) => value))
                  ).sort(),
                  title,
                }
              );

              router.push(`/recipes/${data.slug}`);
            })}
          >
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  label="Title"
                />
              )}
            />
            <Controller
              control={control}
              name="servings"
              render={({ field }) => {
                const a11yId = "servings--label";

                return (
                  <Stack direction="column" gap={1}>
                    <Typography
                      component="h2"
                      gutterBottom
                      id={a11yId}
                      variant="h6"
                    >
                      Servings
                    </Typography>
                    <Slider
                      {...field}
                      aria-labelledby={a11yId}
                      max={10}
                      min={1}
                      onChange={(_, nextValue) => {
                        field.onChange(
                          Array.isArray(nextValue)
                            ? nextValue.map((value) => ({ value }))
                            : [{ value: nextValue }, { value: nextValue }]
                        );
                      }}
                      value={field.value?.map(({ value }) => value)}
                      valueLabelDisplay="auto"
                    />
                  </Stack>
                );
              }}
            />
            <Stack alignItems="start" direction="column" gap={2}>
              <Typography component="h2" gutterBottom variant="h6">
                Ingredients
              </Typography>
              {ingredientsFieldArray.fields.map(({ id }, index) => (
                <Stack
                  alignSelf="stretch"
                  component="li"
                  direction="row"
                  gap={2}
                  justifyContent="space-between"
                  key={id}
                >
                  <Controller
                    control={control}
                    name={`ingredients.${index}.value`}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        error={Boolean(fieldState.error)}
                        fullWidth
                        helperText={fieldState.error?.message}
                        label={`Ingredient ${index + 1}`}
                      />
                    )}
                  />
                  {ingredientsFieldArray.fields.length !== 1 && (
                    <IconButton
                      aria-label={`remove ingredient ${index + 1}`}
                      onClick={() => {
                        ingredientsFieldArray.remove(index);
                      }}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  )}
                </Stack>
              ))}
              <Button
                onClick={() => {
                  ingredientsFieldArray.append({ value: "" });
                }}
                startIcon={<AddCircleOutlineIcon />}
                variant="outlined"
              >
                Add ingredient
              </Button>
            </Stack>
            <Stack direction="row" gap={2} justifyContent="end" mt={4}>
              <Button
                onClick={async () => {
                  try {
                    const { ingredients, servings, title } =
                      await parseRecipeFromClipboard();

                    reset({
                      ingredients: ingredients.map((value) => ({ value })),
                      servings: Array.from({ length: 2 }, (_, index) => ({
                        value: servings[index] ?? servings[0],
                      })),
                      title,
                    });
                  } catch (error) {
                    // TODO: Display error feedback to the user.
                    console.error("Failed to import recipe.", error);
                  }
                }}
                startIcon={<ContentPasteGoIcon />}
                variant="outlined"
              >
                Import recipe from clipboard
              </Button>
              <Button
                disabled={!isValid}
                startIcon={<SaveOutlinedIcon />}
                type="submit"
                variant="contained"
              >
                Save recipe
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </PageTemplate>
  );
};
