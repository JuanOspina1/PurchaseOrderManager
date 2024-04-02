const express = require("express");
const bodyParser = require("body-parser");
const customersController = require("./controllers/customersController");
const itemsController = require("./controllers/itemsController");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/add-customer", customersController.addCustomer);
app.post("/add-item", itemsController.addItem);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
