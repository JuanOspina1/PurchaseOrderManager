import { StatusCodes } from "http-status-codes";
import { ErrorWithStatus } from "../middlewear/ErrorWithStatus";
import prisma from "../prisma/db";
import { CleanDBUserSelect, IsAdmin, MAIN_COMPANY_ID } from "../utils";

/**
 * Retrieves the main company information.
 * @param user_id - The ID of the user making the request.
 * @returns The main company object.
 * @throws ErrorWithStatus if the main company cannot be found.
 */
export const GetMainCompanyService = async (user_id: string) => {
	const UserSelect: any = {
		name: true,
		address: true,
		phone_number: true,
		state: true,
		website: true,
		zip_code: true,
		city: true,
	};

	if (await IsAdmin(user_id))
		UserSelect["users"] = {
			select: CleanDBUserSelect,
		};

	const company = await prisma.main_Company.findUnique({
		where: { id: MAIN_COMPANY_ID },
		select: UserSelect,
	});

	if (!company)
		throw new ErrorWithStatus(
			StatusCodes.INTERNAL_SERVER_ERROR,
			"Could not find the main company, please contact an administrator."
		);

	return company;
};

export const EditMainCompanyService = async ({
	body,
	user_id,
}: {
	body: any;
	user_id: string;
}) => {
	return -1;
};
