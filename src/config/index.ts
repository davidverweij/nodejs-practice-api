import "dotenv/config";
import Joi from "joi";

import DatabaseConfig from "../models/config";

// validate ENV setup
const envValidator = Joi.object()
  .keys({
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.string().required(),
    DB_LOGS: Joi.boolean().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_LIFESPAN: Joi.number().required(),
  })
  .unknown(); // ignore other ENVs

const { value: envVars, error } = envValidator
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(
    `Config validation error in your '.env' file: ${error.message}`
  );
}

const database: DatabaseConfig = {
  name: envVars.DB_NAME,
  user: envVars.DB_USER,
  password: envVars.DB_PASS,
  host: envVars.DB_HOST,
  port: parseInt(envVars.DB_PORT, 10),
  logging: envVars.DB_LOGGING,
};

const jwtSecret: string = envVars.JWT_SECRET;
const jwtLifespan: number = envVars.JWT_LIFESPAN;

export { database, jwtSecret, jwtLifespan };
export * from "./logger";
