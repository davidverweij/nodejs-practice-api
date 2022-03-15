import { Request, Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { StatusCodes } from "http-status-codes";
import { QueryRequestSchema, UserRequestSchema } from "../models";
import { UserService } from "../services";

class UserController {
  static all = async (req: Request, res: Response) => {
    const dbCopy = await UserService.getAll();
    return res.status(StatusCodes.OK).json(dbCopy);
  };

  static suggest = async (
    req: ValidatedRequest<QueryRequestSchema>,
    res: Response
  ) => {
    const { limit, filter } = req.query;
    const result = await UserService.getAutoSuggest(filter, limit);
    return res.status(StatusCodes.OK).json(result);
  };

  static id = async (req: Request, res: Response) => {
    const user = await UserService.findByID(req.params.id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `User '${req.params.id}' was not found.` });
    }
    return res.status(StatusCodes.OK).json(user);
  };

  static create = async (
    req: ValidatedRequest<UserRequestSchema>,
    res: Response
  ) => {
    const { login, password, age } = req.body;
    const userId = await UserService.create(login, password, age);
    return res.status(StatusCodes.CREATED).json({ id: userId });
  };

  static update = async (
    req: ValidatedRequest<UserRequestSchema>,
    res: Response
  ) => {
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
  };

  static delete = async (req: Request, res: Response) => {
    const success = await UserService.delete(req.params.id);
    if (!success) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `User '${req.params.id}' was not found.` });
    }
    return res.status(StatusCodes.NO_CONTENT).send();
  };
}

export default UserController;
