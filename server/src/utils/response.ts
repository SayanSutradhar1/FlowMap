import { Response } from "express";

export default function SendJSONResponse<T>(
  res: Response,
  success: boolean,
  statusCode: number,
  message: string,
  data?: T
) {
  return res.status(statusCode).json({
    status: statusCode,
    success,
    message,
    data,
  });
}
