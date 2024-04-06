import { Request, Response } from "express";
import {
	loginController,
	registerController,
} from "../controllers/auth.controller";
import Wrapper from "../middlewear/Wrapper";

const express = require("express");
const Router = express.Router();

Router.route("/").get((req: Request, res: Response) => {
	res.send("Hello World Auth");
});

Router.route("/login").post(Wrapper(loginController));
Router.route("/register").post(Wrapper(registerController));

export default Router;
