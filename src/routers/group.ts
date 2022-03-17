import express from "express";
import { createValidator } from "express-joi-validation";

import { idSchema } from "../models/userValidation";
import { groupSchema } from "../models/groupValidation";
import { GroupController } from "../controllers";

const groupRoute = express.Router();

const validator = createValidator({});

// Get copy of DB (for debugging/testing)
groupRoute.get("/all", GroupController.all);

// Get group by ID
groupRoute.get("/:id", validator.params(idSchema), GroupController.id);

// Create user
groupRoute.post("/", validator.body(groupSchema), GroupController.create);

// Update group by ID
groupRoute.put(
  "/:id",
  validator.params(idSchema),
  validator.body(groupSchema),
  GroupController.update
);

// Soft-delete user by ID
groupRoute.delete("/:id", validator.params(idSchema), GroupController.delete);

export default groupRoute;
