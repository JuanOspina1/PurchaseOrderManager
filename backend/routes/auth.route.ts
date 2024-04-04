import { Request, Response } from "express";

const express = require("express");
const Router = express.Router();

Router.route("/").get((req: Request, res: Response) => {
	res.send("Hello World Auth");
});

export default Router;
