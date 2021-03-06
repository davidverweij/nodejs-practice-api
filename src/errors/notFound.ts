import { StatusCodes } from "http-status-codes";
import BaseError from "./base";

class NotFoundError extends BaseError {
  constructor(message: string) {
    super("NotFoundError", StatusCodes.NOT_FOUND, message);
  }
}

export default NotFoundError;
