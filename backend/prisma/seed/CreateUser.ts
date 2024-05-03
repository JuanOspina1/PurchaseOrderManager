import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
const prisma = new PrismaClient();

interface CreateUserProps {
	email: string;
	first_name: string;
	last_name: string;
	password: string;
	address: string;
	isAdmin: boolean;
}

export const CreateUser = async ({
	email,
	first_name,
	last_name,
	password,
	address,
	isAdmin,
}: CreateUserProps) => {
	const data: {
		email: string;
		first_name: string;
		last_name: string;
		password: string;
		address: string;
		is_admin: boolean;
	} = { email, first_name, last_name, password, address, is_admin: isAdmin };

	// Replace the password field with the hashed password.
	data["password"] = await argon2.hash(password);

	return await prisma.user.upsert({
		where: {
			email,
		},
		create: data,
		update: {},
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
		},
	});
};
