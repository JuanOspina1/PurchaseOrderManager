import { Request, Response } from "express";
import sqlite3 from "sqlite3";
const dbPath = "./myproject.db";

export const addItem = (req: Request, res: Response): void => {
  const { name, description, price } = req.body;
  const db = new sqlite3.Database(dbPath);

  db.run(
    "INSERT INTO items (name, description, price) VALUES (?, ?, ?)",
    [name, description, price],
    function (this: sqlite3.RunResult, err: Error | null) {
      db.close();

      if (err) {
        console.error("Error adding item", err.message);
        res.status(500).send("Failed to add item");
        return;
      }

      res.status(201).json({ id: this.lastID, name, description, price });
    }
  );
};
