import { Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { StatusCodes } from "http-status-codes";
import { GroupAssignRequestSchema } from "../models/userValidation";
import { UserGroupService } from "../services";
import { NotFoundError } from "../errors";

class UserGroupController {
  static addToGroup = async (
    req: ValidatedRequest<GroupAssignRequestSchema>,
    res: Response
  ) => {
    const { groupId, userIds } = req.body;
    try {
      await UserGroupService.addManyToGroup(groupId, userIds);
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: err.message });
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Users could not be added to the group." });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
  };
}

export default UserGroupController;
