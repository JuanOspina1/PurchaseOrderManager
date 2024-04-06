import { Request, Response } from "express";
import {
	LoginUserService,
	RegisterUserService,
} from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import { generateAccessToken, generateRefreshToken } from "../utils";

export const loginController = async (req: Request, res: Response) => {
	const loginUser = await LoginUserService({
		email: req.body.email,
		password: req.body.password,
	});

	// Generate tokens
	const accessToken = generateAccessToken(loginUser.id);
	const refreshToken = generateRefreshToken(loginUser.id);

	// Set cookies in the response
	res.cookie("access_token", accessToken, {
		httpOnly: true,
		expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes,
	});

	res.cookie("refresh_token", refreshToken, {
		httpOnly: true,
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days,
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
