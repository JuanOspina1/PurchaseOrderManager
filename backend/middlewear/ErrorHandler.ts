import { NextFunction, Request, Response } from "express";

export const ErrorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	process.env.NODE_ENV === "development" && console.log(err);
	res.status(err.status || 500);
	return res.json({
		success: false,
		message: err.message,
		error: err,
	});
};
