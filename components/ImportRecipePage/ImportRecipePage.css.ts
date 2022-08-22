import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const stack = recipe({
  base: {
    display: "flex",
  },
  defaultVariants: {
    direction: "column",
    gap: 1,
  },
  variants: {
    direction: {
      column: {
        flexDirection: "column",
      },
      row: {
        flexDirection: "row",
      },
    },
    gap: {
      0: { gap: 0 },
      0.5: { gap: "4px" },
      1: { gap: "8px" },
      2: { gap: "16px" },
      3: { gap: "24px" },
      4: { gap: "32px" },
    },
  },
});

export const container = style([
  stack({ gap: 2 }),
  {
    margin: "0 auto",
    maxWidth: "100ch",
    padding: "10ch",
  },
]);

export const field = stack({ gap: 0.5 });

export const recipeInput = style({
  minHeight: "20ch",
  resize: "vertical",
});
