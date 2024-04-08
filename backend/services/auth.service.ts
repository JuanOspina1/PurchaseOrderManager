const argon2 = require("argon2");
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { ErrorWithStatus } from "../middlewear/ErrorWithStatus";
import prisma from "../prisma/db";
import { checkFields } from "../utils";
const validator = require("email-validator");

interface UserRegisterBody {
	first_name?: string;
	last_name?: string;
	email?: string;
	password?: string;
}

export const RegisterUserService = async (body: UserRegisterBody) => {
	const {
		first_name = null,
		last_name = null,
		email = null,
		password = null,
	} = body;
	const requiredFields = checkFields([
		{ name: "first_name", field: first_name },
		{ name: "last_name", field: last_name },
		{ name: "email", field: email },
		{ name: "password", field: password },
	]);

	if (requiredFields !== null)
		throw new ErrorWithStatus(
			StatusCodes.BAD_REQUEST,
			"Missing required fields " + requiredFields.join(", ")
		);

	// Verify email, and password
	if (!validator.validate(email))
		throw new ErrorWithStatus(StatusCodes.BAD_REQUEST, "Invalid email.");

	if (password && !new RegExp(/[a-zA-Z0-9]{6,30}/).test(password))
		throw new ErrorWithStatus(
			StatusCodes.BAD_REQUEST,
			"Password does not match our criteria."
		);

	const hashedPassword = await argon2.hash(password);

	try {
		await prisma.user.create({
			data: {
				first_name: first_name || "",
				last_name: last_name || "",
				email: email || "",
				password: hashedPassword,
			},
		});
		return { first_name, last_name, email };
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

export const LoginUserService = async (body: {
	email?: string;
	password?: string;
}) => {
	const { email = null, password = null } = body;
	const requiredFields = checkFields([
		{ name: "email", field: email },
		{ name: "password", field: password },
	]);

	if (requiredFields !== null)
		throw new ErrorWithStatus(
			StatusCodes.BAD_REQUEST,
			"Missing required fields " + requiredFields.join(", ")
		);

	const user = await prisma.user.findUnique({
		where: { email: email || undefined },
	});

	if (!user)
		throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "User not found.");

	const validatePassword = await argon2.verify(user.password, password);

	if (!validatePassword)
		throw new ErrorWithStatus(StatusCodes.BAD_REQUEST, "Invalid password.");

	return { ...user, password: null };
};
