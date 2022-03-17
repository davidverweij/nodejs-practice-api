import Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import { MissingJwtError } from "../errors";

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const jwtAuthSchema = Joi.object({
  "x-access-token": Joi.string()
    .required()
    .error(() => {
      throw new MissingJwtError("No token provided");
    }),
});

interface AuthRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    password: string;
  };
}

interface TokenRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Headers]: {
    "x-access-token": string;
  };
}

export { loginSchema, jwtAuthSchema, AuthRequestSchema, TokenRequestSchema };
