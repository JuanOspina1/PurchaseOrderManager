import { Response } from "express";
import { Req } from "../types";
import {
	EditMainCompanyService,
	GetMainCompanyService,
} from "../services/main_company.service";
import { StatusCodes } from "http-status-codes";

export const GetMainCompany = async (req: Req, res: Response) => {
	const company = await GetMainCompanyService(req.user.id);
	return res.status(StatusCodes.OK).json({ message: "success", data: company });
};

export const EditMainCompany = async (req: Req, res: Response) => {
	const company = await EditMainCompanyService({
		body: req.body,
		user_id: req.user.id,
	});

	return res.status(StatusCodes.OK).json({ message: "success", data: company });
};
