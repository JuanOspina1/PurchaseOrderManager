import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "./ErrorWithStatus";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Req } from "../types";
import { CleanDBUserSelect, generateAccessToken } from "../utils";
import prisma from "../prisma/db";
import { getUserService } from "../services/user.service";
const jwt = require("jsonwebtoken");

const AuthenticatedOnly = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	const bearerHeader = req.headers["authorization"];

	try {
		if (typeof bearerHeader !== "undefined") {
			const bearer = bearerHeader.split(" ");
			const token = bearer[1];

			const decodedAccessToken = jwt.verify(
				token,
				process.env.JWT_ACCESS_SECRET
			);

			const user = await getUserService(decodedAccessToken.userId);

			(req as any).user = { id: decodedAccessToken.userId, ...user };
		}

		const user = await prisma.user.findUnique({
			where: { id: (req as any).user.id },
			select: CleanDBUserSelect,
		});

		if (!user) {
			next(new ErrorWithStatus(StatusCodes.NOT_FOUND, "User not found."));
		} else {
			(req as any).user = user;
			next();
		}
	} catch (err) {
		next(
			new ErrorWithStatus(StatusCodes.UNAUTHORIZED, "Authentication failed.")
		);
	}
};

export default AuthenticatedOnly;
