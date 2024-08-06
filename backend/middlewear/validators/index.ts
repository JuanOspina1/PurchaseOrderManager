import Joi from "joi";
import { ErrorWithStatus } from "../ErrorWithStatus";
import { StatusCodes } from "http-status-codes";

const validator = (schema: Joi.ObjectSchema<any>, data: any) => {
	const { error } = schema.validate(data, { abortEarly: false });

	if (error) {
		const formattedErrors = error.details.map((detail) => ({
			field: detail.path.join("."),
			message: detail.message.replace(/['"]/g, ""),
		}));
		throw new ErrorWithStatus(
			StatusCodes.UNPROCESSABLE_ENTITY,
			JSON.stringify(formattedErrors),
			true
		);
	}
	return 0;
};

export default validator;
