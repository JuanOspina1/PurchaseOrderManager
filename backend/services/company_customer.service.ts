import { StatusCodes } from "http-status-codes";
import { ErrorWithStatus } from "../middlewear/ErrorWithStatus";
import prisma from "../prisma/db";
import { checkFields } from "../utils";
import { Req, UserType } from "../types";

const customer_service_select = {
	id: true,
	name: true,
	address: true,
	zip_code: true,
	city: true,
	state: true,
	website: true,
	phone_number: true,
	customers: {
		select: {
			id: true,
			first_name: true,
			last_name: true,
		},
	},
	_count: true,
};

export const GetCustomerCompaniesService = async (props: {
	page?: number;
	limit?: number;
	sortOrder: 1 | -1;
	filters: Partial<{
		name: any;
		state: any;
		city: any;
		address: any;
	}>;
}) => {
	const { page = 1, limit = 10, sortOrder } = props;
	const whereClause = <
		{
			name?: { equals: any };
			state?: { equals: any };
			city?: { equals: any };
			address?: { equals: any };
		}
	>{};

	if (props.filters) {
		if (props.filters.name) whereClause.name = { equals: props.filters.name };
		if (props.filters.state)
			whereClause.state = { equals: props.filters.state };
		if (props.filters.city) whereClause.city = { equals: props.filters.city };
		if (props.filters.address)
			whereClause.address = { equals: props.filters.address };
	}

	return await prisma.customer_Company.findMany({
		where: whereClause,
		select: {
			id: true,
			name: true,
			address: true,
			zip_code: true,
			city: true,
			state: true,
			website: true,
			phone_number: true,
			customers: {
				select: {
					id: true,
				},
			},
			_count: true,
		},
		take: limit,
		skip: (page - 1) * limit,
		orderBy: {
			customers: {
				_count: sortOrder === 1 ? "asc" : "desc",
			},
		},
	});
};

export const GetCustomerCompanyService = async (id: string, user: UserType) => {
	const company = await prisma.customer_Company.findUnique({
		where: {
			id,
		},
		select: customer_service_select,
	});

	if (!company)
		throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "Company not found.");

	if (
		user.is_admin ||
		company.customers.find((customer) => customer.id === user.id)
	)
		return company;
	else
		throw new ErrorWithStatus(
			StatusCodes.UNAUTHORIZED,
			"You do not have permission to access this resource."
		);
};

export const createCustomerCompanyService = async (data: {
	address: any;
	city: string;
	name: string;
	phone_number: string;
	state: string;
	website: string;
	zip_code: string;
	// customers: string[];
}) => {
	const {
		address,
		city,
		name,
		phone_number,
		state,
		website,
		zip_code,
		// customers,
	} = data;

	const requiredFields = checkFields([
		{ field: name, name: "name" },
		{ field: address, name: "address" },
		{ field: city, name: "city" },
		{ field: phone_number, name: "phone_number" },
		{ field: state, name: "state" },
		{ field: website, name: "website" },
		{ field: zip_code, name: "zip_code" },
	]);

	if (requiredFields !== null) {
		throw new ErrorWithStatus(
			StatusCodes.BAD_REQUEST,
			`The following fields are required: ${requiredFields.join(", ")}`.trim()
		);
	}

	if (typeof phone_number !== "number") {
		throw new ErrorWithStatus(
			StatusCodes.BAD_REQUEST,
			`The phone number must be a number.`
		);
	}

	// if (customers) {
	// 	if (!Array.isArray(customers))
	// 		throw new ErrorWithStatus(
	// 			StatusCodes.BAD_REQUEST,
	// 			`The customers field must be an array.`
	// 		);
	// 	customers.forEach((customer_id: any) => {
	// 		if (typeof customer_id !== "string") {
	// 			throw new ErrorWithStatus(
	// 				StatusCodes.BAD_REQUEST,
	// 				`The customer id must be a string. ${customer_id.toString()}`
	// 			);
	// 		}
	// 	});
	// }

	try {
		const company = await prisma.customer_Company.create({
			data: {
				name,
				address,
				city,
				phone_number,
				state,
				website,
				zip_code,
				// customers: {
				// 	connect: customers.map((customer_id) => ({ id: customer_id })),
				// },
			},
			select: customer_service_select,
		});
		return company;
	} catch (error: any) {
		process.env.NODE_ENV === "development" && console.log(error);
		if (error.code === "P2018")
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"Invalid customer id's provided."
			);
		throw new ErrorWithStatus(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const UpdateCustomerCompanyService = async ({
	id,
	data,
}: {
	id: string;
	data: Partial<{
		name: string;
		address: string;
		city: string;
		phone_number: string;
		state: string;
		website: string;
		zip_code: string;
	}>;
}) => {
	const { address, city, name, phone_number, state, website, zip_code } = data;
	const company = await prisma.customer_Company.update({
		where: { id },
		data: {
			address: address && address,
			city: city && city,
			name: name && name,
			phone_number: phone_number && phone_number,
			state: state && state,
			website: website && website,
			zip_code: zip_code && zip_code,
		},
		select: customer_service_select,
	});

	return company;
};

export const DeleteCustomerCompanyService = async (id: string) => {
	try {
		await prisma.customer_Company.delete({
			where: { id },
		});
	} catch (error: any) {
		process.env.NODE_ENV === "development" && console.log(error);
		if (error.code === "P2025")
			throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "Company not found.");
		throw new ErrorWithStatus(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const AddCustomerToCustomerCompanyService = async ({
	company_id,
	customers,
}: {
	company_id: string;
	customers: string | string[];
}) => {
	try {
		if (!customers || customers.length === 0) {
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"Please provide a customer id."
			);
		}

		if (typeof customers !== "string" && !Array.isArray(customers))
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"Invalid customers provided. Please provide a customer id or an array of customer id's."
			);

		if (
			Array.isArray(customers) &&
			customers.some((customer) => typeof customer !== "string")
		)
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"Invalid customer id's provided."
			);

		const company = await prisma.customer_Company.update({
			where: { id: company_id },
			data: {
				customers: {
					connect: Array.isArray(customers)
						? customers.map((customer_id) => ({ id: customer_id }))
						: [{ id: customers }],
				},
			},
			select: customer_service_select,
		});

		return company;
	} catch (error: any) {
		process.env.NODE_ENV === "development" && console.log(error);
		if (error.code === "P2025")
			throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "Company not found.");
		if (error.code === "P2018")
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"Invalid customer id's provided."
			);
		throw new ErrorWithStatus(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
	}
};

export const RemoveCustomerFromCustomerCompanyService = async ({
	company_id,
	customers,
}: {
	company_id: string;
	customers: string | string[];
}) => {
	try {
		if (!customers || customers.length === 0) {
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"Please provide a customer id."
			);
		}

		if (typeof customers !== "string" && !Array.isArray(customers))
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"Invalid customers provided. Please provide a customer id or an array of customer id's."
			);

		if (
			Array.isArray(customers) &&
			customers.some((customer) => typeof customer !== "string")
		)
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"Invalid customer id's provided."
			);

		const company = await prisma.customer_Company.update({
			where: { id: company_id },
			data: {
				customers: {
					disconnect: Array.isArray(customers)
						? customers.map((customer_id) => ({ id: customer_id }))
						: [{ id: customers }],
				},
			},
			select: customer_service_select,
		});

		return company;
	} catch (error: any) {
		process.env.NODE_ENV === "development" && console.log(error);
		if (error.code === "P2025")
			throw new ErrorWithStatus(StatusCodes.NOT_FOUND, "Company not found.");
		if (error.code === "P2018")
			throw new ErrorWithStatus(
				StatusCodes.BAD_REQUEST,
				"Invalid customer id's provided."
			);
		throw new ErrorWithStatus(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
	}
};
