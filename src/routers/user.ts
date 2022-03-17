import express from "express";
import { createValidator } from "express-joi-validation";

import {
  idSchema,
  userSchema,
  querySchema,
  groupAssignSchema,
} from "../models/userValidation";
import { UserController, UserGroupController } from "../controllers";
import { jwtAuthSchema } from "../models/authValidation";
import { AuthService } from "../services/auth";

const userRoute = express.Router();

const validator = createValidator({});

// all routes in userRoute are protected by JWT access
userRoute.use(validator.headers(jwtAuthSchema), AuthService.checkToken);

// Get copy of DB (for debugging/testing)
userRoute.get("/all", UserController.all);

// Query DB based on substring for login
userRoute.get("/suggest", validator.query(querySchema), UserController.suggest);

// Add multiple users to a permissions group
userRoute.put(
  "/togroup",
  validator.body(groupAssignSchema),
  UserGroupController.addToGroup
);

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

export default userRoute;
