import AuthenticatedOnly from "../middlewear/AuthenticatedOnly";
import {
	createUserController,
	deleteUserController,
	editUserController,
	getUserController,
	getUsersController,
} from "../controllers/user.controller";
import Wrapper from "../middlewear/Wrapper";

import express from "express";
const Router = express.Router();

Router.route("/")
	.get(AuthenticatedOnly, Wrapper(getUsersController))
	.post(AuthenticatedOnly, Wrapper(createUserController));

Router.route("/:id")
	.get(AuthenticatedOnly, Wrapper(getUserController))
	.delete(AuthenticatedOnly, Wrapper(deleteUserController))
	.patch(AuthenticatedOnly, Wrapper(editUserController));

export default Router;
