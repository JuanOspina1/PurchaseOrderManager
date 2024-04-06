import { sign } from "jsonwebtoken";

interface fieldsType {
	name: string;
	field: any;
}

/**
 * Checks if the required fields in an array of fields are present.
 * @param fields - An array of fields to be checked.
 * @returns An array of field names that are missing, or null if all fields are present.
 */

export const checkFields = (fields: fieldsType[]) => {
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
	return sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
};

/**
 * Generates a refresh token for a given user ID.
 * @param userId - The ID of the user.
 * @returns The generated refresh token.
 */
export const generateRefreshToken = (userId: string) => {
	return sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};
