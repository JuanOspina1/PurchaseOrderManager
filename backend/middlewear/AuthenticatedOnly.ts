import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "./ErrorWithStatus";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Req } from "../types";
import { CleanDBUserSelect, generateAccessToken } from "../utils";
import prisma from "../prisma/db";
const jwt = require("jsonwebtoken");

const AuthenticatedOnly = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {

	const bearerHeader = req.headers['authorization'];

	try {
		if (typeof bearerHeader !== 'undefined') {
			const bearer = bearerHeader.split(' ');
			const token = bearer[1];

			const decodedAccessToken = jwt.verify(
				token,
				process.env.JWT_ACCESS_SECRET
			);
			userId = decodedAccessToken.userId;
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: CleanDBUserSelect,
		});

		if (!user) {
			next(new ErrorWithStatus(StatusCodes.NOT_FOUND, "User not found."));
		} else {
			req.user = user;
			next();
		}
	}
	catch (err) {
		next(
			new ErrorWithStatus(StatusCodes.UNAUTHORIZED, "Authentication failed.")
		);
	}
}


export default AuthenticatedOnly;
