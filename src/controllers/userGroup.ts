import { Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { StatusCodes } from "http-status-codes";
import { GroupAssignRequestSchema } from "../models/userValidation";
import { UserGroupService } from "../services";

class UserGroupController {
  static addToGroup = async (
    req: ValidatedRequest<GroupAssignRequestSchema>,
    res: Response
  ) => {
    const { groupId, userIds } = req.body;
    await UserGroupService.addManyToGroup(groupId, userIds);
    return res.status(StatusCodes.NO_CONTENT).send();
  };
}

export default UserGroupController;
