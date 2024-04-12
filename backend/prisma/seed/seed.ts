import { PrismaClient } from "@prisma/client";
import { CreateUser } from "./CreateUser";
import { CreateMainCompany } from "./CreateMainCompany";
const prisma = new PrismaClient();

async function main() {
	try {
		await CreateMainCompany();

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
