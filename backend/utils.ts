import { sign } from "jsonwebtoken";
export const MAIN_COMPANY_ID = "cluwuwvzm000014dacku6cvqp";

interface fieldsType {
	name: string;
	field: any;
}

/**
 * Checks if the required fields in an array of fields are present.
 * @param fields - An array of fields to be checked.
 * @returns An array of field names that are missing, or null if all fields are present.
 */

const _checkFields = (fields: fieldsType[]) => {
	let errors = <String[]>[];

	fields.forEach((field) => {
		if (!field.field) {
			errors.push(field.name);
		}
	});

	return errors.length === 0 ? null : errors;
};

/**
 * Generates a access token for a given user ID.
 * @param userId - The ID of the user.
 * @returns The generated access token.
 */
export const generateAccessToken = (userId: string) => {
	return sign({ userId }, process.env.JWT_ACCESS_SECRET as string, {
		expiresIn: "15m",
	});
};

/**
 * Generates a refresh token for a given user ID.
 * @param userId - The ID of the user.
 * @returns The generated refresh token.
 */
export const generateRefreshToken = (userId: string) => {
	return sign({ userId }, process.env.JWT_REFRESH_SECRET as string, {
		expiresIn: "7d",
	});
};

export const CleanDBUserSelect = {
	id: true,
	first_name: true,
	last_name: true,
	email: true,
	address: true,
	is_admin: true,
};

/**
 * Generates a random password of the specified length.
 * @param length - The length of the password to generate.
 * @returns The randomly generated password.
 * If the length is less than 6, null is returned.
 */
export const PasswordGenerator = (length: number) => {
	if (length < 6) return null;
	const possibleCharacters = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYX0123456789!@#$*&'()*+,-./|:;<=>?~"`;
	let password = "";
	for (let i = 0; i < length; i++) {
		password +=
			possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];
	}
	return password;
};

// export const IsAdmin = async (user_id: string) => {
// 	const main_company = await prisma.main_Company.findUnique({
// 		where: { id: MAIN_COMPANY_ID },
// 		select: {
// 			users: true,
// 		},
// 	});

// 	if (!main_company)
// 		throw new ErrorWithStatus(
// 			StatusCodes.INTERNAL_SERVER_ERROR,
// 			ReasonPhrases.INTERNAL_SERVER_ERROR
// 		);

// 	const admins = main_company.users;

// 	return admins.find((admin) => admin.id === user_id) ? true : false;
// };
