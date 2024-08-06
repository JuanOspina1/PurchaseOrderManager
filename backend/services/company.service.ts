import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorWithStatus } from "../middlewear/ErrorWithStatus";
import prisma from "../prisma/db";
import { UserType } from "../types";

// THIS NEEDS TO BE REFACTORED TO ONLY GET COMPANY - EDIT COMPANY - AND ADD USER TO COMPANY
interface GetCompanies {
	user: UserType;
	company_id: string;
}

const company_select_fields = {
	id: true,
	name: true,
	address: true,
	phone_number: true,
	state: true,
	website: true,
	zip_code: true,
};

// /**
//  * Retrieves a company based on the provided user and company IDs.
//  * @param user_id - The ID of the user making the request.
//  * @param company_id - The ID of the company to retrieve.
//  * @returns The company object if found.
//  * @throws ErrorWithStatus with NOT_FOUND status code if the company is not found.
//  * @throws ErrorWithStatus with UNAUTHORIZED status code if the user is not authorized to access the company.
//  */

export const GetCompanyService = async (company_id: string) => {
	const company = await prisma.company.findUnique({
		where: { id: company_id },
		select: company_select_fields,
	});

	if (!company)
		throw new ErrorWithStatus(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

	return company;
};

// /**
//  * Retrieves a list of companies based on the user ID.
//  * If the user is an admin, all companies are returned.
//  * If the user is not an admin, only the companies owned by the user or associated with the user as a customer are returned.
//  * @param user The ID of the user
//  * @returns A promise that resolves to an array of companies
//  */
// export const GetCompaniesService = async (user: UserType) => {
// 	if (user.is_admin) {
// 		return await prisma.company.findMany({
// 			where: {},
// 			select: company_select_fields,
// 		});
// 	} else {
// 		return await prisma.company.findMany({
// 			where: {
// 				OR: [
// 					{
// 						customers: {
// 							some: {
// 								id: user.id,
// 							},
// 						},
// 					},
// 				],
// 			},
// 			select: company_select_fields,
// 		});
// 	}
// };

/**
 * Creates a new company with the provided information.
 *
 * @param body - The company details including name, address, phone number, city, state, website, zip code, and customers.
 * @param user - The user performing the operation.
 * @returns The newly created company.
 * @throws ErrorWithStatus - If the user is not authorized or if there are missing required fields or invalid customer IDs.
 */
export const CreateCompanyService = async ({
	body,
	user,
}: {
	body: {
		name: string;
		address: string;
		phone_number: string;
		city: string;
		state: string;
		website: string;
		zip_code: string;
	};
	user: UserType;
}) => {
	if (!user.is_admin)
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			ReasonPhrases.UNAUTHORIZED
		);

	const { name, address, phone_number, city, state, website, zip_code } = body;

	// const requiredFields = checkFields([
	// 	{ name: "name", field: name },
	// 	{ name: "address", field: address },
	// 	{ name: "phone_number", field: phone_number },
	// 	{ name: "city", field: city },
	// 	{ name: "state", field: state },
	// 	{ name: "website", field: website },
	// 	{ name: "zip_code", field: zip_code },
	// ]);

	// // TODO: phone number validation

	// if (requiredFields !== null)
	// 	throw new ErrorWithStatus(
	// 		StatusCodes.BAD_REQUEST,
	// 		"Missing required fields " + requiredFields.join(", ")
	// 	);

	const company = await prisma.company.create({
		data: {
			name,
			address,
			phone_number,
			city,
			state,
			website,
			zip_code,
		},
		select: company_select_fields,
	});

	return company;
};

/**
 * Edits a company's information.
 * @param company_id - The ID of the company to edit.
 * @param user_id - The ID of the user performing the edit.
 * @param body - The updated company information.
 * @returns The updated company object.
 * @throws ErrorWithStatus - If the company is not found, the user is not authorized, or an invalid owner_id is provided.
 */

export const EditCompanyService = async ({
	company_id,
	user,
	body,
}: {
	company_id: string;
	user: UserType;
	body: any;
}) => {
	const company = await prisma.company.findUnique({
		where: { id: company_id },
	});

	if (!company)
		throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "Company not found.");

	if (!user.is_admin)
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			ReasonPhrases.UNAUTHORIZED
		);

	const { name, address, phone_number, city, state, website, zip_code } = body;

	try {
		return await prisma.company.update({
			where: {
				id: company_id,
			},
			data: {
				name: name && name,
				address: address && address,
				phone_number: phone_number && phone_number,
				city: city && city,
				state: state && state,
				website: website && website,
				zip_code: zip_code && zip_code,
			},
			select: company_select_fields,
		});
	} catch (error: any) {
		process.env.NODE_ENV === "development" && console.log(error);
		throw new ErrorWithStatus(
			StatusCodes.INTERNAL_SERVER_ERROR,
			ReasonPhrases.INTERNAL_SERVER_ERROR
		);
	}
};

// /**
//  * Deletes a company service.
//  * @param {Object} params - The parameters for deleting a company service.
//  * @param {string} params.id - The ID of the company to delete.
//  * @param {string} params.user_id - The ID of the user performing the delete operation.
//  * @throws {ErrorWithStatus} Throws an error if the user is not authorized or if there is an internal server error.
//  * @throws {ErrorWithStatus} Throws an error if the company is not found.
//  */
// export const DeleteCompanyService = async ({
// 	id,
// 	user,
// }: {
// 	id: string;
// 	user: UserType;
// }) => {
// 	if (!user.is_admin)
// 		throw new ErrorWithStatus(
// 			StatusCodes.UNAUTHORIZED,
// 			ReasonPhrases.UNAUTHORIZED
// 		);

// 	try {
// 		await prisma.company.delete({
// 			where: { id: id },
// 		});
// 		return;
// 	} catch (error: any) {
// 		process.env.NODE_ENV === "development" && console.log(error);
// 		if (error.code === `P2025`)
// 			throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "Company not found.");
// 		else
// 			throw new ErrorWithStatus(
// 				StatusCodes.INTERNAL_SERVER_ERROR,
// 				ReasonPhrases.INTERNAL_SERVER_ERROR
// 			);
// 	}
// };
