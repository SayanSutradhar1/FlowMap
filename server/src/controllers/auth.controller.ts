import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/prisma";
import ApiError from "../utils/apiError";
import Wrapper, { Controller } from "../utils/asyncWrapper";
import SendToken from "../utils/sendToken";
import SendJSONResponse from "../utils/response";

const SignIn = Wrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new ApiError(400, "Please provide email and password"));
  }

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    next(new ApiError(404, "User not found"));
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    next(new ApiError(401, "Invalid credentials"));
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

  const decoded = jwt.decode(token);

  console.log(decoded);

  SendToken(
    res,
    token,
    "Login successful",
    200,
    new Date(Date.now() + 15 * 60 * 1000)
  );
  return;
});

const SignOut: Controller = (_, res) => {
  res.clearCookie("token");
  SendJSONResponse(res, true, 200, "Logout successful");
  return;
};

const GetSignedInUser = Wrapper(async (req, res) => {
  const token = req.cookies.token as string;

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

  const user = await db.user.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    SendJSONResponse(res, false, 404, "User not found");
    return;
  }

  SendJSONResponse(res, true, 200, "User found", user);
  return;
});

export { SignIn, SignOut, GetSignedInUser };
