import { Response } from "express";
import { Req } from "../types";
import { StatusCodes } from "http-status-codes";
import {
	AddCustomerToCustomerCompanyService,
	DeleteCustomerCompanyService,
	GetCustomerCompaniesService,
	GetCustomerCompanyService,
	RemoveCustomerFromCustomerCompanyService,
	UpdateCustomerCompanyService,
	createCustomerCompanyService,
} from "../services/company_customer.service";

export const getCustomerCompanies = async (req: Req, res: Response) => {
	const { limit, page, address, city, name, state, sortOrder } = req.query;
	const companies = await GetCustomerCompaniesService({
		page: isNaN(Number(page)) ? undefined : Number(page),
		limit: isNaN(Number(limit)) ? undefined : Number(limit),
		sortOrder: Number(sortOrder) as 1 | -1,
		filters: {
			address,
			city,
			name,
			state,
		},
	});
	return res
		.status(StatusCodes.OK)
		.json({ message: "success", data: companies });
};

export const createCustomerCompany = async (req: Req, res: Response) => {
	const company = await createCustomerCompanyService(req.body);
	return res
		.status(StatusCodes.CREATED)
		.json({ message: "created", data: company });
};

export const getCustomerCompany = async (req: Req, res: Response) => {
	const {
		params: { id },
		user,
	} = req;

	const company = await GetCustomerCompanyService(id, user);
	return res.status(StatusCodes.OK).json({ message: "success", data: company });
};

export const updateCustomerCompany = async (req: Req, res: Response) => {
	const { id } = req.params;
	const company = await UpdateCustomerCompanyService({ id, data: req.body });
	return res
		.status(StatusCodes.OK)
		.json({ message: "updated.", data: company });
};

export const deleteCustomerCompany = async (req: Req, res: Response) => {
	const {
		params: { id },
	} = req;

	await DeleteCustomerCompanyService(id);
	return res.status(StatusCodes.NO_CONTENT).json({ message: "created." });
};

export const addCustomerToCustomerCompany = async (req: Req, res: Response) => {
	const {
		params: { id },
		body,
	} = req;
	const company = await AddCustomerToCustomerCompanyService({
		company_id: id,
		customers: body.customers,
	});
	return res.status(StatusCodes.OK).json({ message: "success", data: company });
};

export const removeCustomerFromCustomerCompany = async (
	req: Req,
	res: Response
) => {
	const {
		params: { id },
		body,
	} = req;
	const company = await RemoveCustomerFromCustomerCompanyService({
		company_id: id,
		customers: body.customers,
	});
	return res.status(StatusCodes.OK).json({ message: "success", data: company });
};
