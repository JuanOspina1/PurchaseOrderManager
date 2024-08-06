import Joi from "joi";

export const CreateCompanySchema = Joi.object({
	name: Joi.string().required(),
	address: Joi.string().required(),
	phone_number: Joi.string().required(),
	city: Joi.string().required(),
	state: Joi.string().required(),
	website: Joi.string().required(),
	zip_code: Joi.string().required(),
});

export const UpdateCompanySchema = Joi.object({
	name: Joi.string().optional(),
	address: Joi.string().optional(),
	phone_number: Joi.string().optional(),
	city: Joi.string().optional(),
	state: Joi.string().optional(),
	website: Joi.string().optional(),
	zip_code: Joi.string().optional(),
});

export const CustomersToCompanySchema = Joi.object({
	customers: Joi.alternatives(
		Joi.array().items(Joi.string()),
		Joi.string()
	).required(),
});
