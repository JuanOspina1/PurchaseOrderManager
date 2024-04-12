import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Req } from "../types";
import {
	CreateCompanyService,
	DeleteCompanyService,
	EditCompanyService,
	GetCompaniesService,
	GetCompanyService,
} from "../services/company.service";

export const CreateCompany = async (req: Request, res: Response) => {
	const Company = await CreateCompanyService({});
	return res.status(StatusCodes.CREATED).json({
		success: true,
		data: Company,
	});
};

export const GetCompany = async (req: Req, res: Response) => {
	const {
		params: { id },
		user,
	} = req;
	const Company = await GetCompanyService({ company_id: id, user_id: user.id });
	return res.status(StatusCodes.OK).json({ success: true, data: Company });
};

export const GetCompanies = async (req: Request, res: Response) => {
	const Companies = await GetCompaniesService({});
	return res.status(StatusCodes.OK).json({ success: true, data: Companies });
};

export const DeleteCompany = async (req: Req, res: Response) => {
	const { id } = req.params;
	await DeleteCompanyService({ id });
	return res.status(StatusCodes.NO_CONTENT).json({ success: true });
};

export const EditCompany = async (req: Req, res: Response) => {
	const { id } = req.params;
	const Company = await EditCompanyService({ id });
	return res.status(StatusCodes.OK).json({ success: true, data: Company });
};