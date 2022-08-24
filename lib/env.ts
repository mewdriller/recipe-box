import { z } from "zod";

const EnvSchema = z.object({
  EDAMAM_APP_ID: z.string().min(1),
  EDAMAM_APP_KEY: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export type ENV = z.infer<typeof EnvSchema>;

export const ENV = EnvSchema.parse(process.env);
