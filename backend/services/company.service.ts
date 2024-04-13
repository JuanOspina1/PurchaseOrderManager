import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorWithStatus } from "../middlewear/ErrorWithStatus";
import prisma from "../prisma/db";
import { CleanDBUserSelect, IsAdmin, checkFields } from "../utils";
import { User } from "../types";

interface GetCompanies {
	user_id: string;
	company_id: string;
}

interface CompanyProps {
	id: string;
	user: User;
}

const company_select_fields = {
	name: true,
	address: true,
	phone_number: true,
	state: true,
	website: true,
	zip_code: true,
	owner: {
		select: CleanDBUserSelect,
	},
	customers: true,
};

/**
 * Retrieves a company based on the provided user and company IDs.
 * @param user_id - The ID of the user making the request.
 * @param company_id - The ID of the company to retrieve.
 * @returns The company object if found.
 * @throws ErrorWithStatus with NOT_FOUND status code if the company is not found.
 * @throws ErrorWithStatus with UNAUTHORIZED status code if the user is not authorized to access the company.
 */

export const GetCompanyService = async ({
	user_id,
	company_id,
}: GetCompanies) => {
	const company = await prisma.customer_Company.findUnique({
		where: { id: company_id },
		select: company_select_fields,
	});

	if (!company)
		throw new ErrorWithStatus(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

	// Ensures that the user sending the GET request is either the company's owner, or one of the customers of the company or is an admin.
	if (
		!(
			(company.owner && company.owner.id === user_id) ||
			company.customers.find((customer) => customer.owner_id === user_id) ||
			(await IsAdmin(user_id))
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
 * @param user_id The ID of the user
 * @returns A promise that resolves to an array of companies
 */
export const GetCompaniesService = async (user_id: string) => {
	if (await IsAdmin(user_id)) {
		return await prisma.customer_Company.findMany({
			where: {},
			select: { id: true, ...company_select_fields },
		});
	} else {
		return await prisma.customer_Company.findMany({
			where: {
				OR: [
					{
						owner_id: user_id,
					},
					{
						customers: {
							some: {
								owner_id: user_id,
							},
						},
					},
				],
			},
			select: { id: true, ...company_select_fields },
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
	user_id,
}: {
	body: {
		name: string;
		address: string;
		phone_number: number;
		city: string;
		state: string;
		website: string;
		zip_code: string;
		owner_id: string;
	};
	user_id: string;
}) => {
	if (!(await IsAdmin(user_id)))
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			ReasonPhrases.UNAUTHORIZED
		);

	const {
		name,
		address,
		phone_number,
		city,
		state,
		website,
		zip_code,
		owner_id,
	} = body;

	const requiredFields = checkFields([
		{ name: "name", field: name },
		{ name: "address", field: address },
		{ name: "phone_number", field: phone_number },
		{ name: "city", field: city },
		{ name: "state", field: state },
		{ name: "website", field: website },
		{ name: "zip_code", field: zip_code },
		{ name: "owner_id", field: owner_id },
	]);

	// TODO: phone number validation
	// TODO: customer company upon creation

	if (requiredFields !== null)
		throw new ErrorWithStatus(
			StatusCodes.BAD_REQUEST,
			"Missing required fields " + requiredFields.join(", ")
		);

	const company = await prisma.customer_Company.create({
		data: {
			owner_id,
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

export const EditCompanyService = async ({ id, user }: CompanyProps) => {
	return 1;
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
	user_id,
}: {
	id: string;
	user_id: string;
}) => {
	if (!(await IsAdmin(user_id)))
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			ReasonPhrases.UNAUTHORIZED
		);

	try {
		await prisma.customer_Company.delete({
			where: { id: id },
		});
		return;
	} catch (error: any) {
		process.env.NODE_ENV === "development" && console.log(error);
		if (error.code === `P2025`)
			throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "User not found.");
		else
			throw new ErrorWithStatus(
				StatusCodes.INTERNAL_SERVER_ERROR,
				ReasonPhrases.INTERNAL_SERVER_ERROR
			);
	}
};
