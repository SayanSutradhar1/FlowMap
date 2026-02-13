import Wrapper from "../utils/asyncWrapper";
import { db } from "../config/prisma";
import ApiError from "../utils/apiError";
import bcrypt from "bcrypt";
import SendJSONResponse from "../utils/response";
import { redis } from "../main";
import { sendMail } from "../utils/mailer";
import { ExpenseCategory } from "../../generated/prisma/enums";

const NewUser = Wrapper(async (req, res) => {
  const { name, email, password, state, profession, age, gender } = req.body;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (user) {
    if (user.isVerified) {
      SendJSONResponse(res, false, 409, "User already exists");
      return;
    }

    try {
      await Promise.all([
      db.cashRecovery.deleteMany({
        where: {
          expense: {
            userId: user.id,
          },
        },
      }),
      db.transaction.deleteMany({
        where: { userId: user.id },
      }),
      db.cash.delete({
        where: { userId: user.id },
      }),
      db.expense.deleteMany({
        where: { userId: user.id },
      }),
      db.inflow.deleteMany({
        where: { userId: user.id },
      }),
      db.budget.deleteMany({
        where: {
          userId: user.id,
          category: {
            in: [...Object.values(ExpenseCategory)],
          },
        },
      }),
      db.user.delete({
        where: { id: user.id },
      }),
    ]);
    } catch (error) {
      console.log(error);
    }
    
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
      age: Number(age),
      gender,
      verificationOtp: otp,
    },
  });

  if (!newUser) {
    SendJSONResponse(res, false, 500, "Failed to create user");
    return;
  }

  try {
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
      },
    );
    return;
  } catch (error) {
    console.log(error);

    await db.user.delete({
      where: { id: newUser.id },
    });

    SendJSONResponse(res, false, 500, "Failed to send OTP");
    return;
  }
});

const VerifyUser = Wrapper(async (req, res) => {
  const { email, otp } = req.body;

  const user = await db.user.findUnique({
    where: { email, isVerified: false },
  });

  if (!user) {
    SendJSONResponse(res, false, 404, "User not found");
    return;
  }

  try {
    if (user.verificationOtp !== otp) {
      SendJSONResponse(res, false, 400, "Invalid OTP");
      return;
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationOtp: undefined,
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
  } catch (error) {
    console.log(error);

    await db.user.delete({
      where: { id: user.id },
    });

    SendJSONResponse(
      res,
      false,
      500,
      "Failed to verify user... Please create account again",
    );
    return;
  }
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

  // let user = JSON.parse((await redis.get(`user_${id}`)) || "null");

  // if (user) {
  //   SendJSONResponse(res, true, 200, "User found", user);
  //   return;
  // }

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      state: true,
      profession: true,
      isVerified: true,
      createdAt: true,
    },
  });

  // await redis.setex(`user_${id}`, 60 * 10, JSON.stringify(user));

  if (!user) {
    SendJSONResponse(res, false, 404, "User not found");
    return;
  }

  SendJSONResponse(res, true, 200, "User found", user);
  return;
});

const GetUserByEmail = Wrapper(async (req, res) => {
  const { email } = req.params;

  let user = JSON.parse((await redis.get(`user_${email}`)) || "null");

  if (user) {
    SendJSONResponse(res, true, 200, "User found", user);
    return;
  }

  user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    SendJSONResponse(res, false, 404, "User not found");
    return;
  }

  await redis.setex(`user_${email}`, 60 * 10, JSON.stringify(user));

  SendJSONResponse(res, true, 200, "User found", user);
  return;
});

const AbortVerification = Wrapper(async (req, res) => {
  const { email } = req.body;

  await db.user.delete({
    where: { email },
  });

  SendJSONResponse(res, true, 200, "Verification has been aborted");
  return;
});

export {
  NewUser,
  RemoveUser,
  GetUser,
  VerifyUser,
  GetUserByEmail,
  AbortVerification,
};
