import { Response } from "express";
import ApiError from "../utils/apiError";
import SendJSONResponse from "../utils/response";

const ErrorMiddleware = (
  err: Error,
  _req: unknown,
  res: Response,
) => {
  let statusCode;
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
  } else {
    statusCode = 500;
  }
  return SendJSONResponse(
    res,
    false,
    statusCode,
    err.message || "Something went wrong"
  );
};

export default ErrorMiddleware;
