import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorWithStatus } from "../middlewear/ErrorWithStatus";
import prisma from "../prisma/db";
import { CleanDBUserSelect, checkFields } from "../utils";
import { UserType } from "../types";

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
	customers: {
		select: { ...CleanDBUserSelect, is_admin: false },
	},
};

/**
 * Retrieves a company based on the provided user and company IDs.
 * @param user_id - The ID of the user making the request.
 * @param company_id - The ID of the company to retrieve.
 * @returns The company object if found.
 * @throws ErrorWithStatus with NOT_FOUND status code if the company is not found.
 * @throws ErrorWithStatus with UNAUTHORIZED status code if the user is not authorized to access the company.
 */

export const GetCompanyService = async ({ user, company_id }: GetCompanies) => {
	const company = await prisma.company.findUnique({
		where: { id: company_id },
		select: company_select_fields,
	});

	if (!company)
		throw new ErrorWithStatus(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

	// Ensures that the user sending the GET request is either the company's owner, or one of the customers of the company or is an admin.
	if (
		!(
			company.customers.find((customer) => customer.id === user.id) ||
			user.is_admin
		)
	)
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			ReasonPhrases.UNAUTHORIZED
		);

	return company;
};

/**
 * Retrieves a list of companies based on the user ID.
 * If the user is an admin, all companies are returned.
 * If the user is not an admin, only the companies owned by the user or associated with the user as a customer are returned.
 * @param user The ID of the user
 * @returns A promise that resolves to an array of companies
 */
export const GetCompaniesService = async (user: UserType) => {
	if (user.is_admin) {
		return await prisma.company.findMany({
			where: {},
			select: company_select_fields,
		});
	} else {
		return await prisma.company.findMany({
			where: {
				OR: [
					{
						customers: {
							some: {
								id: user.id,
							},
						},
					},
				],
			},
			select: company_select_fields,
		});
	}
};

/**
 * Creates a new company service.
 * @param {Object} options - The options for creating a company service.
 * @param {Object} options.body - The body of the request containing company details.
 * @param {string} options.body.name - The name of the company.
 * @param {string} options.body.address - The address of the company.
 * @param {number} options.body.phone_number - The phone number of the company.
 * @param {string} options.body.city - The city of the company.
 * @param {string} options.body.state - The state of the company.
 * @param {string} options.body.website - The website of the company.
 * @param {string} options.body.zip_code - The zip code of the company.
 * @param {string} options.body.owner_id - The ID of the owner of the company.
 * @param {string} options.user_id - The ID of the user making the request.
 * @returns {Promise<Object>} The created company.
 * @throws {ErrorWithStatus} If the user is not authorized or if required fields are missing.
 */
export const CreateCompanyService = async ({
	body,
	user,
}: {
	body: {
		name: string;
		address: string;
		phone_number: number;
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

	const requiredFields = checkFields([
		{ name: "name", field: name },
		{ name: "address", field: address },
		{ name: "phone_number", field: phone_number },
		{ name: "city", field: city },
		{ name: "state", field: state },
		{ name: "website", field: website },
		{ name: "zip_code", field: zip_code },
	]);

	// TODO: phone number validation
	// TODO: customer company upon creation

	// TODO: support being able to add customers
	// const owner = await prisma.user.findUnique({
	// 	where: { id: owner_id },
	// 	include: { c_company: true },
	// });

	// if (!owner)
	// 	throw new ErrorWithStatus(
	// 		StatusCodes.BAD_REQUEST,
	// 		"Invalid owner_id provided."
	// 	);
	// // TODO: figure out if a user can only own one company.
	// if (owner.c_company && owner.c_company.id !== null)
	// 	throw new ErrorWithStatus(
	// 		StatusCodes.BAD_REQUEST,
	// 		"User already owns a company."
	// 	);

	if (requiredFields !== null)
		throw new ErrorWithStatus(
			StatusCodes.BAD_REQUEST,
			"Missing required fields " + requiredFields.join(", ")
		);

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

/**
 * Adds customers to a company.
 * @param company_id - The ID of the company.
 * @param customer_ids - An array of customer IDs to be added to the company.
 * @returns The updated company object with the added customers.
 * @throws ErrorWithStatus with status code 404 if the company is not found.
 */

export const AddCustomersToCompanyService = async ({
	company_id,
	customer_ids,
	user,
}: {
	company_id: string;
	customer_ids: string[];
	user: UserType;
}) => {
	if (!user.is_admin)
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			ReasonPhrases.UNAUTHORIZED
		);

	const company = await prisma.company.findUnique({
		where: { id: company_id },
		include: { customers: true },
	});

	if (!company) {
		throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "Company not found.");
	}

	if (!(customer_ids instanceof Array))
		throw new ErrorWithStatus(
			StatusCodes.BAD_REQUEST,
			"Invalid customer_ids provided."
		);

	const customersToAdd = customer_ids.filter((customer_id) => {
		// Returns customers that are not already added to the company
		return !company.customers.find((customer) => customer.id === customer_id);
	});

	if (customersToAdd.length === 0)
		throw new ErrorWithStatus(
			StatusCodes.NO_CONTENT,
			"No customers were added to the company."
		);

	try {
		// Add customers to the company
		return await prisma.company.update({
			where: { id: company_id },
			data: {
				customers: {
					connect: customersToAdd.map((customer_id) => ({ id: customer_id })),
				},
			},
			select: company_select_fields,
		});
	} catch (error: any) {
		if (error.code === "P2018")
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"some of the ids provided are not valid."
			);
		process.env.NODE_ENV === "development" && console.log(error);
		throw new ErrorWithStatus(
			StatusCodes.INTERNAL_SERVER_ERROR,
			ReasonPhrases.INTERNAL_SERVER_ERROR
		);
	}
};

// Remove customers from company
/**
 * Removes customers from a company.
 * @param {Object} params - The parameters for removing customers from a company.
 * @param {string} params.company_id - The ID of the company.
 * @param {string[]} params.customer_ids - The IDs of the customers to be removed.
 * @returns {Promise<Object>} - A promise that resolves to the updated company object.
 * @throws {ErrorWithStatus} - If the company is not found.
 */

export const RemoveCustomersFromCompanyService = async ({
	company_id,
	customer_ids,
	user,
}: {
	company_id: string;
	customer_ids: string[];
	user: UserType;
}) => {
	if (!user.is_admin)
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			ReasonPhrases.UNAUTHORIZED
		);

	const company = await prisma.company.findUnique({
		where: { id: company_id },
		include: { customers: true },
	});

	if (!company) {
		throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "Company not found.");
	}

	if (!(customer_ids instanceof Array))
		throw new ErrorWithStatus(
			StatusCodes.BAD_REQUEST,
			"Invalid customer_ids provided."
		);

	// Filter out non-existing customers
	const customersToRemove = customer_ids.filter((customer_id) => {
		return company.customers.find((customer) => customer.id === customer_id);
	});

	if (customersToRemove.length === 0)
		throw new ErrorWithStatus(
			StatusCodes.NO_CONTENT,
			"No customers were removed."
		);

	// Remove customers from the company
	return await prisma.company.update({
		where: { id: company_id },
		data: {
			customers: {
				disconnect: customersToRemove.map((customer_id) => ({
					id: customer_id,
				})),
			},
		},
		select: company_select_fields,
	});
};

/**
 * Deletes a company service.
 * @param {Object} params - The parameters for deleting a company service.
 * @param {string} params.id - The ID of the company to delete.
 * @param {string} params.user_id - The ID of the user performing the delete operation.
 * @throws {ErrorWithStatus} Throws an error if the user is not authorized or if there is an internal server error.
 * @throws {ErrorWithStatus} Throws an error if the company is not found.
 */
export const DeleteCompanyService = async ({
	id,
	user,
}: {
	id: string;
	user: UserType;
}) => {
	if (!user.is_admin)
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			ReasonPhrases.UNAUTHORIZED
		);

	try {
		await prisma.company.delete({
			where: { id: id },
		});
		return;
	} catch (error: any) {
		process.env.NODE_ENV === "development" && console.log(error);
		if (error.code === `P2025`)
			throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "Company not found.");
		else
			throw new ErrorWithStatus(
				StatusCodes.INTERNAL_SERVER_ERROR,
				ReasonPhrases.INTERNAL_SERVER_ERROR
			);
	}
};
