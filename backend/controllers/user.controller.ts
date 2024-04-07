import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
	createUserService,
	deleteUserService,
	getUserService,
	getUsersService,
} from "../services/user.service";
import { Req } from "../types";

export const getUserController = async (req: Request, res: Response) => {
	const { id: userId } = req.params;
	const user = await getUserService(userId);
	return res.status(StatusCodes.OK).json({
		success: true,
		data: user,
	});
};

export const getUsersController = async (req: Request, res: Response) => {
	const { limit, page } = req.query;
	const users = await getUsersService({
		limit: limit ? Number(limit) : undefined,
		page: page ? Number(page) : undefined,
		query: "",
	});
	return res.status(StatusCodes.OK).json({ success: true, data: users });
};

export const createUserController = async (req: Req, res: Response) => {
	const user = await createUserService({
		body: req.body,
		activeUser: req.user,
	});
	return res.status(StatusCodes.OK).json({ success: true, data: user });
};
export const editUserController = async (req: Request, res: Response) => {};

export const deleteUserController = async (req: Req, res: Response) => {
	const { id: userId } = req.params;
	await deleteUserService({ userId, activeUser: req.user });
	return res.status(StatusCodes.NO_CONTENT).json({
		success: true,
	});
};
