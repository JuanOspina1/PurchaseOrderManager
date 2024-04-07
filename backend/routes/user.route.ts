import { Request, Response } from "express";
import AuthenticatedOnly from "../middlewear/AuthenticatedOnly";
import {
	createUserController,
	deleteUserController,
	editUserController,
	getUserController,
	getUsersController,
} from "../controllers/user.controller";
import Wrapper from "../middlewear/Wrapper";

const express = require("express");
const Router = express.Router();

Router.route("/")
	.get(AuthenticatedOnly, getUsersController)
	.post(AuthenticatedOnly, Wrapper(createUserController));

Router.route("/:id")
	.get(AuthenticatedOnly, Wrapper(getUserController))
	.delete(AuthenticatedOnly, Wrapper(deleteUserController))
	.patch(AuthenticatedOnly, Wrapper(editUserController));

export default Router;
