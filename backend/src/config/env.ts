import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  FRONTEND_URL: z.string().url().optional(),
  CLIENT_URL: z.string().url().optional()
});

const parsedEnv = envSchema.parse(process.env);
const frontendUrl = parsedEnv.FRONTEND_URL ?? parsedEnv.CLIENT_URL ?? "http://localhost:5173";

export const env = {
  nodeEnv: parsedEnv.NODE_ENV,
  port: parsedEnv.PORT,
  databaseUrl: parsedEnv.DATABASE_URL,
  jwtSecret: parsedEnv.JWT_SECRET,
  frontendUrl
};
