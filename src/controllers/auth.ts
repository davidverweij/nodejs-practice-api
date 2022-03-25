import { Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { StatusCodes } from "http-status-codes";
import { AuthRequestSchema } from "../models/authValidation";
import { AuthService } from "../services/auth";

class AuthController {
  static login = async (
    req: ValidatedRequest<AuthRequestSchema>,
    res: Response
  ) => {
    const token = AuthService.getJwt(req.body);
    return res.status(StatusCodes.OK).json({ token });
  };
}

export default AuthController;
