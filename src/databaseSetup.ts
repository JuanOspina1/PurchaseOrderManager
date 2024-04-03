import sqlite3 from "sqlite3";

const dbPath = "./myproject.db";
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log("Connected to the SQLite database.");
});

db.serialize(() => {
  db.run(`DROP TABLE IF EXISTS customers`);
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      company_name TEXT,
      address TEXT
    )
  `);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the database connection.");
});
