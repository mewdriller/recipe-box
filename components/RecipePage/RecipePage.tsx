import { FC, Fragment, useState } from "react";
import { Recipe } from "@/lib/types";
import { PageTemplate } from "../PageTemplate";

const roundNutrientAmount = (value: number): number => Number(value.toFixed(2));

export const RecipePage: FC<Recipe> = ({
  ingredients,
  nutrition,
  servings,
  title,
}) => {
  const [servingsChoice, setServingsChoice] = useState<number>(
    servings[servings.length - 1]
  );
  const servingsRange =
    servings.length === 1
      ? servings
      : Array.from(
          { length: servings[1] - servings[0] + 1 },
          (_, index) => servings[0] + index
        );

  return (
    <PageTemplate>
      <h1>{title}</h1>
      <p>Servings: {servings.join(" - ")}</p>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={`${index}-${ingredient}`}>{ingredient}</li>
        ))}
      </ul>
      <label>
        Servings:{" "}
        <select
          disabled={servingsRange.length === 1}
          onChange={(event) => {
            setServingsChoice(parseInt(event.target.value));
          }}
          value={servingsChoice}
        >
          {servingsRange.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <dl>
        <dt>Calories</dt>
        <dd>{roundNutrientAmount(nutrition.calories / servingsChoice)}</dd>
        {Object.entries(nutrition.totalNutrientsKCal).map(
          ([key, { label, quantity, unit }]) => (
            <Fragment key={key}>
              <dt>{label}</dt>
              <dd>
                {roundNutrientAmount(quantity / servingsChoice)} {unit}
              </dd>
            </Fragment>
          )
        )}
      </dl>
    </PageTemplate>
  );
};
