import { PrismaClient } from "@prisma/client";
import { MAIN_COMPANY_ID } from "../../utils";
const prisma = new PrismaClient();

export const CreateMainCompany = async () => {
	return await prisma.main_Company.upsert({
		create: {
			id: MAIN_COMPANY_ID,
			name: "Main Company",
			address: "123 Main St.",
			phone_number: 1234567890,
			state: "CA",
			website: "www.main.com",
			zip_code: "94043",
			city: "Central City",
		},
		update: {
			name: "Main Company",
			address: "123 Main St.",
			phone_number: 1234567890,
			state: "CA",
			website: "www.main.com",
			zip_code: "94043",
			city: "Central City",
		},
		where: {
			id: MAIN_COMPANY_ID,
		},
	});
};
