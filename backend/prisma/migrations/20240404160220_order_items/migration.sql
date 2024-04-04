/*
  Warnings:

  - You are about to drop the column `cases` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `lbs` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `lbs_per_price` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `packaging` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `upc_codes` on the `Item` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packaging" TEXT NOT NULL,
    "cases" TEXT NOT NULL,
    "upc_codes" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "lbs" REAL NOT NULL,
    "lbs_per_price" REAL NOT NULL,
    "total" REAL NOT NULL,
    "item_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    CONSTRAINT "OrderItem_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "new_Item" ("id") SELECT "id" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
