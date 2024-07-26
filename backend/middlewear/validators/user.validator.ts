import Joi from "joi";

export const RegisterUserSchema = Joi.object({
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

export const LoginUserSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(1).required(),
});

export const CreateUserSchema = Joi.object({
	first_name: Joi.string().required(),
	last_name: Joi.string().required(),
	email: Joi.string().email().required(),
});
