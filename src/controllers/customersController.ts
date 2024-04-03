import { Request, Response } from "express";
import sqlite3 from "sqlite3";
const dbPath = "./myproject.db";

export const addCustomer = (req: Request, res: Response): void => {
  const { name, email, company_name, address } = req.body;
  const db = new sqlite3.Database(dbPath);

  db.run(
    "INSERT INTO customers (name, email, company_name, address) VALUES (?, ?, ?, ?)",
    [name, email, company_name, address],
    function (this: sqlite3.RunResult, err: Error | null) {
      db.close();

      if (err) {
        console.error("Error adding customer", err.message);
        res.status(500).send("Failed to add customer");
        return;
      }

      res
        .status(201)
        .json({ id: this.lastID, name, email, company_name, address });
    }
  );
};
