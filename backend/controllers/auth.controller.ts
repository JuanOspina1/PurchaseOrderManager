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

	res.cookie("access_token", accessToken, {
		httpOnly: true,
		expires: new Date(
			Date.now() +
				parseInt((process.env.ACCESS_COOKIE as unknown as string) ?? 0)
		),
	});

	res.cookie("refresh_token", refreshToken, {
		httpOnly: true,
		expires: new Date(
			Date.now() +
				parseInt((process.env.REFRESH_COOKIE as unknown as string) ?? 0)
		),
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

export const logoutController = async (req: Request, res: Response) => {
	res.clearCookie("access_token");
	res.clearCookie("refresh_token");

	return res.status(StatusCodes.OK).json({
		success: true,
		message: "Logged out successfully",
	});
};
