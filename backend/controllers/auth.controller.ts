import { Request, Response } from "express";
import {
	LoginUserService,
	RegisterUserService,
} from "../services/auth.service";
import { StatusCodes } from "http-status-codes";

export const loginController = async (req: Request, res: Response) => {
	const loginUser = await LoginUserService({
		email: req.body.email,
		password: req.body.password,
	});
	return res.status(StatusCodes.OK).json({ success: true, data: loginUser });
};

export const registerController = async (req: Request, res: Response) => {
	const registerUser = await RegisterUserService({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
	});
	return res.status(StatusCodes.OK).json({ success: true, data: registerUser });
};
