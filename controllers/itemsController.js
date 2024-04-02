const { Pool } = require("pg");

// Setup connection pool for PostgreSQL
const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "mydatabase",
  password: "your_password",
  port: 5432,
});

const addItem = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO items (name, description, price) VALUES ($1, $2, $3) RETURNING *",
      [name, description, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding item", error);
    res.status(500).send("Failed to add item");
  }
};

module.exports = {
  addItem,
};
