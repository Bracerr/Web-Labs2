import { Router } from "express";
import { authHandler } from "../handlers/authHandler.js";

const authRouter = new Router();
authRouter.post("/signup", authHandler.registerUser);

export { authRouter };