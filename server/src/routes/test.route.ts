import { Router } from "express";
import { Mailer } from "../controllers/test.controller";

const testRoute = Router();

testRoute.route("/send-mail").post(Mailer);

export default testRoute;
