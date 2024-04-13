export interface User {
  id: string;
  email : string,
  first_name : string,
  last_name  : string,
  address : string
  avatar?: string;

  [key: string]: unknown;
}

export interface UserWithAccessToken extends User {
  accessToken : string 
}