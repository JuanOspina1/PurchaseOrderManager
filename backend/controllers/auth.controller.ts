import { Request, Response } from "express";
import { RegisterUserService } from "../services/auth.service";

export const loginController = async (req: Request, res: Response) => {
	return res.json({ message: "Login" });
};

export const registerController = async (req: Request, res: Response) => {
	const registerUser = await RegisterUserService({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
	});
	return res.json({ success: true, data: registerUser });
};
