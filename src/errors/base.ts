import { StatusCodes } from "http-status-codes";

class BaseError extends Error {
  constructor(
    readonly name: string,
    readonly httpCode: StatusCodes,
    description: string
  ) {
    super(description);

    this.name = name;
    this.httpCode = httpCode;
  }
}

export default BaseError;
