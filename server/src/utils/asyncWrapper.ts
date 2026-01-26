import { NextFunction, Request, Response } from "express";

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
      next(error);
    }
  };

export default Wrapper;
