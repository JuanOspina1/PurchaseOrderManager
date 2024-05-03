import { Request, Response } from "express";
import {
	getCurrentUser,
	loginController,
	logoutController,
	refreshTokenController,
	registerController,
} from "../controllers/auth.controller";
import Wrapper from "../middlewear/Wrapper";
import AuthenticatedOnly from "../middlewear/AuthenticatedOnly";

const express = require("express");
const Router = express.Router();

Router.route("/login").post(Wrapper(loginController));
Router.route("/refresh").get(Wrapper(refreshTokenController));
Router.route("/user").get(AuthenticatedOnly, Wrapper(getCurrentUser))
// Router.route("/register").post(Wrapper(registerController));
Router.route("/logout").post(AuthenticatedOnly, Wrapper(logoutController));
Router.route("/test").get(AuthenticatedOnly, Wrapper((req : Request, res : Response) => {res.send("hello world")}))

export default Router;
