-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_terms" TEXT NOT NULL,
    "origin_country" TEXT NOT NULL,
    "etd" DATETIME NOT NULL,
    "eta" DATETIME NOT NULL,
    "notes" TEXT NOT NULL,
    "total_weight" TEXT NOT NULL,
    "port_of_entry" TEXT NOT NULL,
    "final_destination" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "packaging" TEXT NOT NULL,
    CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "packaging" TEXT NOT NULL,
    "cases" TEXT NOT NULL,
    "upc_codes" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "lbs" REAL NOT NULL,
    "lbs_per_price" REAL NOT NULL,
    "total" REAL NOT NULL,
    "order_id" TEXT NOT NULL,
    CONSTRAINT "Item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
