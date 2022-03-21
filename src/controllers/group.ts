import { Request, Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { StatusCodes } from "http-status-codes";
import { GroupRequestSchema } from "../models/groupValidation";
import { GroupService } from "../services";

class GroupController {
  static all = async (req: Request, res: Response) => {
    const dbCopy = await GroupService.all();
    return res.status(StatusCodes.OK).json(dbCopy);
  };

  static id = async (req: Request, res: Response) => {
    const user = await GroupService.findByID(req.params.id);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Group '${req.params.id}' was not found.` });
    }
    return res.status(StatusCodes.OK).json(user);
  };

  static create = async (
    req: ValidatedRequest<GroupRequestSchema>,
    res: Response
  ) => {
    const { name, permissions } = req.body;
    const userId = await GroupService.create(name, permissions);
    return res.status(StatusCodes.CREATED).json({ id: userId });
  };

  static update = async (
    req: ValidatedRequest<GroupRequestSchema>,
    res: Response
  ) => {
    const { name, permissions } = req.body;
    const success = await GroupService.update(req.params.id, name, permissions);
    if (!success) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Group '${req.params.id}' was not found.` });
    }
    return res.status(StatusCodes.NO_CONTENT).send();
  };

  static delete = async (req: Request, res: Response) => {
    const success = await GroupService.delete(req.params.id);
    if (!success) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `Group '${req.params.id}' was not found.` });
    }
    return res.status(StatusCodes.NO_CONTENT).send();
  };
}

export default GroupController;
