import { Request, Response } from "express";
import AuthenticatedOnly from "../middlewear/AuthenticatedOnly";

const express = require("express");
const Router = express.Router();

Router.route("/").get(AuthenticatedOnly, (req: Request, res: Response) => {
	res.send("Hello World");
});

export default Router;
