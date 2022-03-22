import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const notFoundRoute = (_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Endpoint not found." });
};

export default notFoundRoute;
