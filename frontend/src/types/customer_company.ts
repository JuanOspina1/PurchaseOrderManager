export interface CustomerCompany {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  avatar?: string;

  [key: string]: unknown;
}

// model Customer_Company {
//     id           String @id @default(cuid())
//     name         String
//     address      String
//     city         String
//     state        String
//     zip_code     String
//     phone_number Int
//     website      String
//     customers        User[]
//   }

// export interface UserWithAccessToken extends User {
//   accessToken: string;
// }
