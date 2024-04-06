import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "./ErrorWithStatus";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Req } from "../types";
import { generateAccessToken } from "../utils";
const jwt = require("jsonwebtoken");

const AuthenticatedOnly = (req: Req, res: Response, next: NextFunction) => {
	try {
		let accessToken = req.cookies.access_token;
		let refreshToken = req.cookies.refresh_token;

		// If access token is missing or expired, try refreshing it with the refresh token
		if (!accessToken) {
			if (!refreshToken) {
				throw new ErrorWithStatus(
					StatusCodes.UNAUTHORIZED,
					"Access token and refresh token are missing."
				);
			}

			const decodedRefreshToken = jwt.verify(
				refreshToken,
				process.env.JWT_REFRESH_SECRET
			);

			// TODO: blacklisting? expiry?
			const userId = decodedRefreshToken.userId;
			req.user = { id: userId };

			accessToken = generateAccessToken(userId);

			res.cookie("access_token", accessToken, {
				httpOnly: true,
				expires: new Date(
					Date.now() +
						parseInt((process.env.ACCESS_COOKIE as unknown as string) ?? 0)
				),
			});
		} else {
			// Verify access token
			const decodedAccessToken = jwt.verify(
				accessToken,
				process.env.JWT_ACCESS_SECRET
			);
			req.user = { id: decodedAccessToken.userId };
		}

		next();
	} catch (error) {
		process.env.NODE_ENV === "development" &&
			console.error("Authentication error:", error);
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			"Authentication failed."
		);
	}
};

export default AuthenticatedOnly;
