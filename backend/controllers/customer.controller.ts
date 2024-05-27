// import { Response } from "express";
// import { StatusCodes } from "http-status-codes";
// import { Req } from "../types";
// import {
// 	getCustomerCompaniesService,
// 	getCustomerCompanyService,
// } from "../services/company_customer.service";

// export const CreateCustomer = async (req: Req, res: Response) => {
// 	const { user, body } = req;
// 	const Company = await CreateCompanyService({
// 		body,
// 		user,
// 	});
// 	return res.status(StatusCodes.CREATED).json({
// 		success: true,
// 		data: Company,
// 	});
// };

// export const GetCustomer = async (req: Req, res: Response) => {
// 	const {
// 		params: { id },
// 		user,
// 	} = req;
// 	const Company = await GetCompanyService({ company_id: id, user });
// 	return res.status(StatusCodes.OK).json({ success: true, data: Company });
// };

// export const Getcustomers = async (req: Req, res: Response) => {
// 	const Companies = await GetCompaniesService(req.user);
// 	return res.status(StatusCodes.OK).json({ success: true, data: Companies });
// };

// export const DeleteCustomer = async (req: Req, res: Response) => {
// 	const {
// 		params: { id },
// 		user,
// 	} = req;
// 	await DeleteCompanyService({ id, user });
// 	return res.status(StatusCodes.NO_CONTENT).json({ success: true });
// };

// export const EditCustomer = async (req: Req, res: Response) => {
// 	const { id } = req.params;
// 	const Company = await EditCompanyService({
// 		company_id: id,
// 		body: req.body,
// 		user: req.user,
// 	});
// 	return res.status(StatusCodes.OK).json({ success: true, data: Company });
// };
