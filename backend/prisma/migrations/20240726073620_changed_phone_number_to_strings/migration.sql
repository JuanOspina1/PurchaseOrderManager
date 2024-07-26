-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "website" TEXT NOT NULL
);
INSERT INTO "new_Customer_Company" ("address", "city", "id", "name", "phone_number", "state", "website", "zip_code") SELECT "address", "city", "id", "name", "phone_number", "state", "website", "zip_code" FROM "Customer_Company";
DROP TABLE "Customer_Company";
ALTER TABLE "new_Customer_Company" RENAME TO "Customer_Company";
CREATE TABLE "new_Company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "website" TEXT NOT NULL
);
INSERT INTO "new_Company" ("address", "city", "id", "name", "phone_number", "state", "website", "zip_code") SELECT "address", "city", "id", "name", "phone_number", "state", "website", "zip_code" FROM "Company";
DROP TABLE "Company";
ALTER TABLE "new_Company" RENAME TO "Company";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
