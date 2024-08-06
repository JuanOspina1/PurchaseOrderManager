import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorWithStatus } from "../middlewear/ErrorWithStatus";
import prisma from "../prisma/db";
import { CleanDBUserSelect, PasswordGenerator } from "../utils";
const validator = require("email-validator");
const argon2 = require("argon2");

interface getUsers {
	query?: string;
	limit?: number;
	page?: number;
}

interface deleteUserBody {
	userId: string;
	activeUser: { id: string };
}

interface newUserBody {
	body: {
		first_name: string;
		last_name: string;
		email: string;
	};
	activeUser: { id: string };
}
export const getUserService = async (id: string) => {
	const user = await prisma.user.findUnique({
		where: { id },
		// No need to return the user id, since they already have it hence why they're able to access the getUserRoute.
		select: { ...CleanDBUserSelect, id: false },
	});

	if (!user)
		throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "User not found.");

	return user;
};

export const getUsersService = async ({
	query,
	limit = 10,
	page = 1,
}: getUsers) => {
	// TODO: ability to get users with a certain name, and stuff.
	return await prisma.user.findMany({
		where: {},
		take: limit,
		skip: (page - 1) * limit,
		select: CleanDBUserSelect,
	});
};

export const createUserService = async ({ body, activeUser }: newUserBody) => {
	const { first_name, last_name, email } = body;
	// const requiredFields = checkFields([
	// 	{ name: "first_name", field: first_name },
	// 	{ name: "last_name", field: last_name },
	// 	{ name: "email", field: email },
	// ]);

	// if (requiredFields !== null)
	// 	throw new ErrorWithStatus(
	// 		StatusCodes.BAD_REQUEST,
	// 		"Missing required fields " + requiredFields.join(", ")
	// 	);

	// Verify email, and password
	if (!validator.validate(email))
		throw new ErrorWithStatus(StatusCodes.BAD_REQUEST, "Invalid email.");

	// TODO: Check if the user has permission to create a new user.
	try {
		// Password is automatically generated for the user, and sent to the user's email address.
		// Temporarily return the user's password back for development purposes.
		const generatedPassword = PasswordGenerator(8);
		const user = await prisma.user.create({
			data: {
				first_name,
				last_name,
				email,
				password: await argon2.hash(generatedPassword),
			},
			select: {
				...CleanDBUserSelect,
				address: false,
			},
		});
		return { ...user, password: generatedPassword };
	} catch (error: any) {
		if (error.code === "P2002" && error.meta.target.includes("email")) {
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"Email provided is already in use."
			);
		} else
			throw new ErrorWithStatus(
				StatusCodes.INTERNAL_SERVER_ERROR,
				ReasonPhrases.INTERNAL_SERVER_ERROR
			);
	}
};

export const deleteUserService = async ({
	userId,
	activeUser,
}: deleteUserBody) => {
	try {
		await prisma.user.delete({
			where: { id: userId },
		});

		return 0;
	} catch (error: any) {
		if (error.code === `P2025`)
			throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "User not found.");
		else
			throw new ErrorWithStatus(
				StatusCodes.INTERNAL_SERVER_ERROR,
				ReasonPhrases.INTERNAL_SERVER_ERROR
			);
	}
};

export const editUserService = async ({}) => {};
