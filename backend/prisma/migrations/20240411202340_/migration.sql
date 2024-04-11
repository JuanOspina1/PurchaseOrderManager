/*
  Warnings:

  - You are about to drop the column `company_name` on the `Customer_Company` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "phone_number" INTEGER NOT NULL,
    "website" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    CONSTRAINT "Customer_Company_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Customer_Company" ("address", "id", "name", "owner_id", "phone_number", "state", "website", "zip_code") SELECT "address", "id", "name", "owner_id", "phone_number", "state", "website", "zip_code" FROM "Customer_Company";
DROP TABLE "Customer_Company";
ALTER TABLE "new_Customer_Company" RENAME TO "Customer_Company";
CREATE UNIQUE INDEX "Customer_Company_owner_id_key" ON "Customer_Company"("owner_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
