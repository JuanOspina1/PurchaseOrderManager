import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Req } from "../types";
import {
	CreateCompanyService,
	EditCompanyService,
	GetCompanyService,
} from "../services/company.service";
import { MAIN_COMPANY_ID } from "../utils";

export const CreateCompany = async (req: Req, res: Response) => {
	const { user, body } = req;
	const Company = await CreateCompanyService({
		body,
		user,
	});
	return res.status(StatusCodes.CREATED).json({
		success: true,
		data: Company,
	});
};

export const GetCompany = async (req: Req, res: Response) => {
	const Company = await GetCompanyService(MAIN_COMPANY_ID);
	return res.status(StatusCodes.OK).json({ success: true, data: Company });
};

// export const GetCompanies = async (req: Req, res: Response) => {
// 	const Companies = await GetCompaniesService(req.user);
// 	return res.status(StatusCodes.OK).json({ success: true, data: Companies });
// };

// export const DeleteCompany = async (req: Req, res: Response) => {
// 	const {
// 		params: { id },
// 		user,
// 	} = req;
// 	await DeleteCompanyService({ id, user });
// 	return res.status(StatusCodes.NO_CONTENT).json({ success: true });
// };

export const EditCompany = async (req: Req, res: Response) => {
	const Company = await EditCompanyService({
		company_id: MAIN_COMPANY_ID,
		body: req.body,
		user: req.user,
	});
	return res.status(StatusCodes.OK).json({ success: true, data: Company });
};
