import { NextFunction, Request, Response } from "express";
import SendJSONResponse from "./response";

export type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

const Wrapper =
  (fn: Controller) =>
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Triggered API at async wrapper");

    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error);
      SendJSONResponse(res, false, 500, (error as Error).message || "Internal Server Error",);
    }
  };

export default Wrapper;
