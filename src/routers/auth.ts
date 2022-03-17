import express from "express";
import { createValidator } from "express-joi-validation";
import { loginSchema } from "../models/authValidation";
import AuthController from "../controllers/auth";
import { passport } from "../services/auth";

const authRoute = express.Router();
const validator = createValidator({});

// Login
authRoute.post(
  "/",
  validator.body(loginSchema),
  passport.authenticate("local", { session: false }),
  AuthController.login
);

export default authRoute;
