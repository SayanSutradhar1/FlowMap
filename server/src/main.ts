import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { Redis } from "ioredis";
import morgan from "morgan";
import Application from "./app";
import { db } from "./config/prisma";
import ErrorMiddleware from "./middlewares/error.middleware";
import authRouter from "./routes/auth.route";
import cashRouter from "./routes/cash.route";
import expenseRouter from "./routes/expense.route";
import userRouter from "./routes/user.route";
import analyticsRouter from "./routes/analytics.route";


dotenv.config({ path: "../.env" });

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

const server = new Application(PORT, "Main Server");
server.init();

const app = server.getApp();

app.use(morgan("dev"));
app.use(cookieParser());

const redis = new Redis({
  port: 11324,
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

server.useRouter({
  path: "/api/user",
  router: userRouter,
});

server.useRouter({
  path: "/api/auth",
  router: authRouter,
});

server.useRouter({
  path: "/api/expense",
  router: expenseRouter,
});

server.useRouter({
  path:"/api/cash",
  router: cashRouter
})

server.useRouter({
  path:"/api/analytics",
  router: analyticsRouter
})

app.use(ErrorMiddleware);

server.start(() => {
  db.$connect()
    .then(() => {
      console.log("Postgres connected successfully");
    })
    .catch((err) => {
      console.log(err);
    });
  redis.on("connect", () => {
    console.log("Redis connected successfully");
  });
  redis.on("error", (err) => {
    console.log(err);
  });
  console.log(
    `${server.name} is running on port:${PORT} in ${process.env.NODE_ENV}mode`
  );
});

export { redis };

