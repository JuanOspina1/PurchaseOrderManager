import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Req } from "../types";
import {
	AddCustomersToCompanyService,
	CreateCompanyService,
	DeleteCompanyService,
	EditCompanyService,
	GetCompaniesService,
	GetCompanyService,
	RemoveCustomersFromCompanyService,
} from "../services/company.service";

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
	const {
		params: { id },
		user,
	} = req;
	const Company = await GetCompanyService({ company_id: id, user });
	return res.status(StatusCodes.OK).json({ success: true, data: Company });
};

export const GetCompanies = async (req: Req, res: Response) => {
	const Companies = await GetCompaniesService(req.user);
	return res.status(StatusCodes.OK).json({ success: true, data: Companies });
};

export const DeleteCompany = async (req: Req, res: Response) => {
	const {
		params: { id },
		user,
	} = req;
	await DeleteCompanyService({ id, user });
	return res.status(StatusCodes.NO_CONTENT).json({ success: true });
};

export const EditCompany = async (req: Req, res: Response) => {
	const { id } = req.params;
	const Company = await EditCompanyService({
		company_id: id,
		body: req.body,
		user: req.user,
	});
	return res.status(StatusCodes.OK).json({ success: true, data: Company });
};

export const AddCustomersToCompany = async (req: Req, res: Response) => {
	const {
		params: { id: company_id },
		body: { customer_ids },
		user,
	} = req;

	const company = await AddCustomersToCompanyService({
		company_id,
		customer_ids,
		user,
	});
	return res.status(StatusCodes.OK).json({ success: true, data: company });
};

export const RemoveCustomersFromCompany = async (req: Req, res: Response) => {
	const {
		params: { id: company_id },
		body: { customer_ids },
		user,
	} = req;

	const company = await RemoveCustomersFromCompanyService({
		company_id,
		customer_ids,
		user,
	});
	return res.status(StatusCodes.OK).json({ success: true, data: company });
};
