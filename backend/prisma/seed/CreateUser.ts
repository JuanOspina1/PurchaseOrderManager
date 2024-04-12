import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { MAIN_COMPANY_ID } from "../../utils";
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
		m_company?: {
			connect: {
				id: string;
			};
		};
	} = { email, first_name, last_name, password, address };

	// Replace the password field with the hashed password.
	data["password"] = await argon2.hash(password);

	if (isAdmin) {
		data["m_company"] = {
			connect: {
				id: MAIN_COMPANY_ID,
			},
		};
	}

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
			m_company: {
				select: {
					id: true,
					name: true,
					address: true,
					phone_number: true,
					state: true,
					website: true,
					zip_code: true,
				},
			},
		},
	});
};
