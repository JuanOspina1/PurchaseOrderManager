import { Request, Response } from "express";
import {
	loginController,
	logoutController,
	registerController,
} from "../controllers/auth.controller";
import Wrapper from "../middlewear/Wrapper";
import AuthenticatedOnly from "../middlewear/AuthenticatedOnly";

const express = require("express");
const Router = express.Router();

Router.route("/").get((req: Request, res: Response) => {
	res.send("Hello World Auth");
});

Router.route("/login").post(Wrapper(loginController));
// Router.route("/register").post(Wrapper(registerController));
Router.route("/logout").post(AuthenticatedOnly, Wrapper(logoutController));

export default Router;
