import { Prisma, PrismaClient } from "@prisma/client";
import { CreateUser } from "./CreateUser";
import { MAIN_COMPANY_ID } from "../../utils";
import argon2 from "argon2";
const prisma = new PrismaClient();

async function main() {
	try {
		await CreateUser({
			email: "admin@main.com",
			password: "test",
			address: "123 Main St",
			first_name: "Admin",
			last_name: "User",
			isAdmin: true,
		});

		await CreateUser({
			email: "normal@main.com",
			password: "test",
			address: "345 Main St",
			first_name: "Normal",
			last_name: "User",
			isAdmin: false,
		});

		await prisma.company.deleteMany();
		await prisma.company.create({
			data: {
				address: "St 919, Zn 40",
				city: "New York",
				name: "Fisheroo",
				phone_number: "1234567",
				state: "Legends",
				website: "fisheroo.com",
				zip_code: "1234",
				id: MAIN_COMPANY_ID,
			},
		});

		// model Customer_Company {
		// 	id           String @id @default(cuid())
		// 	name         String
		// 	address      String
		// 	city         String
		// 	state        String
		// 	zip_code     String
		// 	phone_number Int
		// 	website      String
		// 	customers        User[]
		//   }

		await prisma.customer_Company.create({
			data: {
				address: "1314 NW 42nd Ave",
				city: "Miami",
				name: "MiamiFish",
				phone_number: "1234567",
				state: "FL",
				website: "MiamiFish.com",
				zip_code: "33143",
				customers: {
					createMany: {
						data: [
							{
								email: "one@main.com",
								first_name: "One",
								last_name: "User",
								password: await argon2.hash("test"),
								// password: "test",
							},
							{
								email: "two@main.com",
								first_name: "One",
								last_name: "User",
								password: await argon2.hash("test"),
							},
						],
					},
				},
			},
		});

		console.log("Successfully seeded db.");
	} catch (error) {
		console.log(error);
	}
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
