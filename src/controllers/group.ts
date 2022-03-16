import { Request, Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors";
import { GroupRequestSchema } from "../models/groupValidation";
import { GroupService } from "../services";

class GroupController {
  static all = async (req: Request, res: Response) => {
    const dbCopy = await GroupService.all();
    return res.status(StatusCodes.OK).json(dbCopy);
  };

  static id = async (req: Request, res: Response) => {
    const group = await GroupService.findByID(req.params.id);
    if (!group) {
      throw new NotFoundError(`Group '${req.params.id}' was not found.`);
    }
    return res.status(StatusCodes.OK).json(group);
  };

  static create = async (
    req: ValidatedRequest<GroupRequestSchema>,
    res: Response
  ) => {
    const { name, permissions } = req.body;
    const groupId = await GroupService.create(name, permissions);
    return res.status(StatusCodes.CREATED).json({ id: groupId });
  };

  static update = async (
    req: ValidatedRequest<GroupRequestSchema>,
    res: Response
  ) => {
    const { name, permissions } = req.body;
    const success = await GroupService.update(req.params.id, name, permissions);
    if (!success) {
      throw new NotFoundError(`Group '${req.params.id}' was not found.`);
    }
    return res.status(StatusCodes.NO_CONTENT).send();
  };

  static delete = async (req: Request, res: Response) => {
    const success = await GroupService.delete(req.params.id);
    if (!success) {
      throw new NotFoundError(`Group '${req.params.id}' was not found.`);
    }
    return res.status(StatusCodes.NO_CONTENT).send();
  };
}

export default GroupController;
