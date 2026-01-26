import Wrapper from "../utils/asyncWrapper";
import { db } from "../config/prisma";
import ApiError from "../utils/apiError";
import bcrypt from "bcrypt";
import SendJSONResponse from "../utils/response";
import { redis } from "../main";
import { sendMail } from "../utils/mailer";

const NewUser = Wrapper(async (req, res, next) => {
  const { name, email, password, state, profession } = req.body;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (user) {
    next(new ApiError(409, "User already exists"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser = await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      state,
      profession,
      verificationOtp: otp,
    },
  });

  if (!newUser) {
    next(new ApiError(500, "Failed to create user"));
  }

  await sendMail({
    to: email,
    subject: "Verify your email",
    html: `<h1>Your OTP is ${otp}</h1>`,
    text: `Your OTP is ${otp}`,
  });

  SendJSONResponse(
    res,
    true,
    200,
    "OTP has been sent to your email. Please verify your email to complete the signup process.",
    {
      email: newUser.email,
    }
  );
  return;
});

const VerifyUser = Wrapper(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    next(new ApiError(404, "User not found"));
    return;
  }

  if (user.verificationOtp !== otp) {
    next(new ApiError(400, "Invalid OTP"));
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationOtp: null,
    },
  });

  await db.cash.create({
    data: {
      userId: user.id,
      amount: 0,
      dailyLimit: 100,
    },
  });

  SendJSONResponse(res, true, 200, "User verified successfully");
  return;
});

const RemoveUser = Wrapper(async (req, res, next) => {
  const { id } = req.params;

  const user = await db.user.delete({
    where: { id },
  });

  if (!user) {
    next(new ApiError(404, "User not found"));
  }

  await db.cash.delete({
    where: { userId: id },
  });

  await db.expense.deleteMany({
    where: { userId: id },
  });

  SendJSONResponse(res, true, 200, "User deleted successfully");
  return;
});

const GetUser = Wrapper(async (req, res, next) => {
  const { id } = req.params;

  let user = JSON.parse((await redis.get(`user_${id}`)) || "null");

  if (user) {
    SendJSONResponse(res, true, 200, "User found", user);
    return;
  }

  user = await db.user.findUnique({
    where: { id },
    omit: {
      password: true,
    },
  });

  await redis.setex(`user_${id}`, 60 * 10, JSON.stringify(user));

  if (!user) {
    next(new ApiError(404, "User not found"));
  }

  SendJSONResponse(res, true, 200, "User found", user);
  return;
});

const GetUserByEmail = Wrapper(async (req, res, next) => {
  const { email } = req.params;

  let user = JSON.parse((await redis.get(`user_${email}`)) || "null");

  if(user){
    SendJSONResponse(res, true, 200, "User found", user);
    return;
  }

  user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    next(new ApiError(404, "User not found"));
    return;
  }

  await redis.setex(`user_${email}`, 60 * 10, JSON.stringify(user));

  SendJSONResponse(res, true, 200, "User found", user);
  return;
});

export { NewUser, RemoveUser, GetUser, VerifyUser,GetUserByEmail };
