import axios from "redaxios";
import { ENV } from "./env";

export const getNutritionDetails = (ingredients: string[], title: string) =>
  // TODO: Specify the return type.
  axios.post(
    "https://api.edamam.com/api/nutrition-details",
    { ingredients, title },
    { params: { app_id: ENV.EDAMAM_APP_ID, app_key: ENV.EDAMAM_APP_KEY } }
  );
