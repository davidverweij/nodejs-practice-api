/* eslint max-classes-per-file: ["error", 2] */

import { StatusCodes } from "http-status-codes";
import BaseError from "./base";

class InvalidJwtError extends BaseError {
  constructor(message: string) {
    super("InvalidJwtError", StatusCodes.FORBIDDEN, message);
  }
}

class MissingJwtError extends BaseError {
  constructor(message: string) {
    super("MissingJwtError", StatusCodes.UNAUTHORIZED, message);
  }
}

export { InvalidJwtError, MissingJwtError };
