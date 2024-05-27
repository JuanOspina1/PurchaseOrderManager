import { NextFunction, Request, Response } from "express";
import { Req } from "../types";
import { ErrorWithStatus } from "./ErrorWithStatus";
import { StatusCodes } from "http-status-codes";

const adminOnly = (req: Request, res: Response, next: NextFunction) => {
	if ((req as any).user.is_admin === false)
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			"You are not authorized to access this route."
		);
	next();
};

export default adminOnly;
