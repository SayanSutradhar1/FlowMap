import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/prisma";
import Wrapper, { Controller } from "../utils/asyncWrapper";
import SendJSONResponse from "../utils/response";
import SendToken from "../utils/sendToken";

const SignIn = Wrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    SendJSONResponse(res, false, 400, "Please provide email and password");
    return;
  }

  const user = await db.user.findUnique({
    where: {
      email,
      isVerified: true,
    },
  });

  if (!user) {
    SendJSONResponse(res, false, 404, "User not found");
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    SendJSONResponse(res, false, 401, "Invalid credentials");
    return;
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
      state: true,
      profession: true,
    },
  });

  if (!user) {
    SendJSONResponse(res, false, 404, "User not found");
    return;
  }

  SendJSONResponse(res, true, 200, "User found", user);
  return;
});

export { GetSignedInUser, SignIn, SignOut };

