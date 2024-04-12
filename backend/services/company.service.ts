import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorWithStatus } from "../middlewear/ErrorWithStatus";
import prisma from "../prisma/db";
import { CleanDBUserSelect } from "../utils";
import e from "express";
import { User } from "../types";

interface GetCompanies {
	user_id: string;
	company_id: string;
}

interface CompanyProps {
	id: string;
	user: User;
}

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
		select: {
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
		},
	});

	if (!company)
		throw new ErrorWithStatus(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);

	// Ensures that the user sending the GET request is either the company's owner, or one of the customers of the company.
	if (
		!(
			(company.owner && company.owner.id === user_id) ||
			company.customers.find((customer) => customer.owner_id === user_id)
		)
	)
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			ReasonPhrases.UNAUTHORIZED
		);

	return company;
};

export const GetCompaniesService = async ({}) => {
	return 1;
};

export const CreateCompanyService = async ({
	body,
	user,
}: {
	body: string;
	user: User;
}) => {
	return 1;
};

export const EditCompanyService = async ({ id, user }: CompanyProps) => {
	return 1;
};

export const DeleteCompanyService = async ({ id, user }: CompanyProps) => {
	return 1;
};
