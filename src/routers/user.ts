import express from "express";
import { ValidatedRequest, createValidator } from "express-joi-validation";
import { StatusCodes } from "http-status-codes";

import {
  idSchema,
  userSchema,
  UserRequestSchema,
  querySchema,
  QueryRequestSchema,
} from "../models";
import { UserService } from "../services";

const userRoute = express.Router();

export default userRoute;

const validator = createValidator({});

// Get copy of DB (for debugging/testing)
userRoute.get("/all", async (req, res) => {
  const dbCopy = await UserService.getAll();
  return res.status(StatusCodes.OK).json(dbCopy);
});

// Query DB based on substring for login
userRoute.get(
  "/suggest",
  validator.query(querySchema),
  async (req: ValidatedRequest<QueryRequestSchema>, res) => {
    const { limit, filter } = req.query;
    const result = await UserService.getAutoSuggest(filter, limit);
    return res.status(StatusCodes.OK).json(result);
  }
);

// Get user by ID
userRoute.get("/:id", validator.params(idSchema), async (req, res) => {
  const user = await UserService.findByID(req.params.id);
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `User '${req.params.id}' was not found.` });
  }
  return res.status(StatusCodes.OK).json(user);
});

// Create user
userRoute.post(
  "/",
  validator.body(userSchema),
  async (req: ValidatedRequest<UserRequestSchema>, res) => {
    const { login, password, age } = req.body;
    const userId = await UserService.create(login, password, age);
    return res.status(StatusCodes.CREATED).json({ id: userId });
  }
);

// Update user by ID
userRoute.put(
  "/:id",
  validator.params(idSchema),
  validator.body(userSchema),
  async (req: ValidatedRequest<UserRequestSchema>, res) => {
    const { login, password, age } = req.body;
    const success = await UserService.update(
      req.params.id,
      login,
      password,
      age
    );
    if (!success) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `User '${req.params.id}' was not found.` });
    }
    return res.status(StatusCodes.NO_CONTENT).send();
  }
);

// Soft-delete user by ID
userRoute.delete("/:id", validator.params(idSchema), async (req, res) => {
  const success = await UserService.delete(req.params.id);
  if (!success) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `User '${req.params.id}' was not found.` });
  }
  return res.status(StatusCodes.NO_CONTENT).send();
});
