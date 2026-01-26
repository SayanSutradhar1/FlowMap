import { CookieOptions, Response } from "express";

const SendToken = (
  res: Response,
  token: string,
  message: string,
  statusCode: number,
  expires: Date | number = 15 * 60 * 1000
) => {
  const options: CookieOptions = {
    // expires:
    //   typeof expires === "number" ? new Date(Date.now() + expires) : expires,
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
  };

  return res.status(statusCode).cookie("token", token, options).json({
    status: statusCode,
    success: true,
    message,
  });
};

export default SendToken;
