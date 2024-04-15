import { User } from "../user";

export interface AuthResponse {
    success : boolean,
    accessToken: string,
    data : User
}