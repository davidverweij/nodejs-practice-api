import Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import { GroupPermissions } from "./group";

const groupSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().items(
    Joi.string().valid(...Object.keys(GroupPermissions))
  ),
});

interface GroupRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    permissions: Array<GroupPermissions>;
  };
}

export { groupSchema, GroupRequestSchema };
