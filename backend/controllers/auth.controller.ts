import { Request, Response } from "express";
import {
	LoginUserService,
	RegisterUserService,
} from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import {
	CleanDBUserSelect,
	generateAccessToken,
	generateRefreshToken,
} from "../utils";
import prisma from "../prisma/db";
import { Req } from "../types";
import validator from "../middlewear/validators";
import {
	LoginUserSchema,
	RegisterUserSchema,
} from "../middlewear/validators/user.validator";
const jwt = require("jsonwebtoken");

export const loginController = async (req: Request, res: Response) => {
	validator(LoginUserSchema, req.body);
	const loginUser = await LoginUserService({
		email: req.body.email,
		password: req.body.password,
	});

	// Generate tokens
	// TODO: assign issuer and audience to the jwt payload
	const accessToken = generateAccessToken(loginUser.id);
	const refreshToken = generateRefreshToken(loginUser.id);

	res.cookie("refresh_token", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		expires: new Date(
			Date.now() +
				parseInt((process.env.REFRESH_COOKIE as unknown as string) ?? 0)
		),
	});
	return res
		.status(StatusCodes.OK)
		.json({ success: true, accessToken, data: loginUser });
};

export const refreshTokenController = async (req: Request, res: Response) => {
	const refreshToken = req.cookies.refresh_token;

	if (typeof refreshToken === "undefined") {
		return res.status(401).json({
			success: false,
			message: "Refresh token was not found.",
		});
	}
	const payload = jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_SECRET || "secret"
	);
	const user = await prisma.user.findUnique({
		where: { id: payload.userId },
		select: CleanDBUserSelect,
	});

	if (!user) {
		return res.status(401).json({
			success: false,
			message: "User was not found.",
		});
	}

	// Generate tokens
	const at = generateAccessToken(user.id);
	const rt = generateRefreshToken(user.id);

	res.cookie("refresh_token", rt, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		expires: new Date(
			Date.now() +
				parseInt((process.env.REFRESH_COOKIE as unknown as string) ?? 0)
		),
	});

	return res
		.status(StatusCodes.OK)
		.json({ success: true, accessToken: at, data: user });
};

export const getCurrentUser = async (req: Req, res: Response) => {
	return res.status(StatusCodes.OK).json({ success: true, data: req.user });
};

export const registerController = async (req: Request, res: Response) => {
	validator(RegisterUserSchema, req.body);
	const registerUser = await RegisterUserService({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
	});
	return res.status(StatusCodes.OK).json({ success: true, data: registerUser });
};

export const logoutController = async (req: Request, res: Response) => {
	// res.clearCookie("access_token");
	// TODO: Invalidate accesstokens when logged out
	res.clearCookie("refresh_token");

	return res.status(StatusCodes.OK).json({
		success: true,
		message: "Logged out successfully",
	});
};
