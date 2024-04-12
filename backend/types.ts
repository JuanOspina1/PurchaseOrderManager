import { Request } from "express";

export interface Req extends Request {
	user: User;
}

export interface User {
	id: string;
}
