import Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

const idSchema = Joi.object({
  id: Joi.string().guid().required(),
});

const userSchema = Joi.object({
  login: Joi.string()
    .regex(/^[a-zA-Z]\w{5,29}$/)
    .required()
    .messages({
      // expand error message for clarity
      "string.pattern.base":
        "login should be between 6 and 30 characters (letters, digits or _), without spaces, and must start with a letter",
    }),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{8,30}/)
    .required()
    .messages({
      // expand error message for clarity
      "string.pattern.base":
        "password should be between 8 and 30 alphanumeric characters (letters or digits) without punctuation or spaces",
    }),
  age: Joi.number().min(4).max(130).required(), // number between 4 and 130
});

interface UserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    login: string;
    password: string;
    age: number;
  };
}

const querySchema = Joi.object({
  filter: Joi.string().required(),
  limit: Joi.number().min(1),
});

interface QueryRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    filter: string;
    limit?: number;
  };
}

export {
  idSchema,
  userSchema,
  UserRequestSchema,
  querySchema,
  QueryRequestSchema,
};
