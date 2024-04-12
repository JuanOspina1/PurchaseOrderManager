/*
  Warnings:

  - Added the required column `address` to the `Main_Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Main_Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Main_Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Main_Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `Main_Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `Main_Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Customer_Company` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Main_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "phone_number" INTEGER NOT NULL,
    "website" TEXT NOT NULL
);
INSERT INTO "new_Main_Company" ("id", "name") SELECT "id", "name" FROM "Main_Company";
DROP TABLE "Main_Company";
ALTER TABLE "new_Main_Company" RENAME TO "Main_Company";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "m_company_id" TEXT,
    CONSTRAINT "User_m_company_id_fkey" FOREIGN KEY ("m_company_id") REFERENCES "Main_Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("address", "email", "first_name", "id", "last_name", "password") SELECT "address", "email", "first_name", "id", "last_name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Customer_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "phone_number" INTEGER NOT NULL,
    "website" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "customer_id" TEXT,
    CONSTRAINT "Customer_Company_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Customer_Company_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer_Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Customer_Company" ("address", "customer_id", "id", "name", "owner_id", "phone_number", "state", "website", "zip_code") SELECT "address", "customer_id", "id", "name", "owner_id", "phone_number", "state", "website", "zip_code" FROM "Customer_Company";
DROP TABLE "Customer_Company";
ALTER TABLE "new_Customer_Company" RENAME TO "Customer_Company";
CREATE UNIQUE INDEX "Customer_Company_owner_id_key" ON "Customer_Company"("owner_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
