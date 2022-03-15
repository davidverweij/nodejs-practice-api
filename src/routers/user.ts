import express from "express";
import { createValidator } from "express-joi-validation";

import { idSchema, userSchema, querySchema } from "../models";
import { UserController } from "../controllers";

const userRoute = express.Router();

export default userRoute;

const validator = createValidator({});

// Get copy of DB (for debugging/testing)
userRoute.get("/all", UserController.all);

// Query DB based on substring for login
userRoute.get("/suggest", validator.query(querySchema), UserController.suggest);

// Get user by ID
userRoute.get("/:id", validator.params(idSchema), UserController.id);

// Create user
userRoute.post("/", validator.body(userSchema), UserController.create);

// Update user by ID
userRoute.put(
  "/:id",
  validator.params(idSchema),
  validator.body(userSchema),
  UserController.update
);

// Soft-delete user by ID
userRoute.delete("/:id", validator.params(idSchema), UserController.delete);
