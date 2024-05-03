import { Request } from "express";

export interface Req extends Request {
	user: UserType;
}

export interface UserType {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	address: string | null;
	is_admin: boolean;
}
