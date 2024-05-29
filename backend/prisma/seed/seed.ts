import { Prisma, PrismaClient } from "@prisma/client";
import { CreateUser } from "./CreateUser";
import { MAIN_COMPANY_ID } from "../../utils";
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
				phone_number: 1234567,
				state: "Legends",
				website: "fisheroo.com",
				zip_code: "1234",
				id: MAIN_COMPANY_ID,
			},
		});

		// NEED TO FIGURE OUT HOW TO ADD CUSTOMER_COMPANY TO PRISMA CLIENT
		// await prisma.customer_company.upsert({
		// 	create: {
		// 		address: "St 919, Zn 40",
		// 		city: "New York",
		// 		name: "CustomerFish",
		// 		phone_number: 1234567,
		// 		state: "Florida",
		// 		website: "customerfish.com",
		// 		zip_code: "1234",
		// 		id: "5d6ab5c2-0f8a-44cc-bf05-545c53d219ba",
		// 		customers: {
		// 			connect: {
		// 				email: "normal@main.com",
		// 			},
		// 		},
		// 	},
		// 	update: {
		// 		address: "St 919, Zn 40",
		// 		city: "New York",
		// 		name: "Fisheroo",
		// 		phone_number: 1234567,
		// 		state: "Legends",
		// 		website: "fisheroo.com",
		// 		zip_code: "1234",
		// 	},
		// 	where: {
		// 		id: "cluxtonyf000010wex3x1swss",
		// 	},
		// });

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
