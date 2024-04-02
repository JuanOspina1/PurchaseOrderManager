const { Pool } = require("pg");

// Setup connection pool for PostgreSQL
const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "mydatabase",
  password: "your_password",
  port: 5432,
});

const addCustomer = async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO customers (name, email, age) VALUES ($1, $2, $3) RETURNING *",
      [name, email, age]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding customer", error);
    res.status(500).send("Failed to add customer");
  }
};

module.exports = {
  addCustomer,
};
