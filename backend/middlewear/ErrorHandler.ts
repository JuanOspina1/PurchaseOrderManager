import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "./ErrorWithStatus";

export const ErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	process.env.NODE_ENV === "development" && console.log(err.message);
	res.status(err.status || 500);
	if (err instanceof ErrorWithStatus)
		return res.json({
			success: false,
			message: err.stringified ? JSON.parse(err.message) : err.message,
		});
	return res.json({
		success: false,
		message:
			"An unexpected error occurred. Kindly contact an administrator if the error presists.",
	});
};
