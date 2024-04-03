import express, { Express } from "express";
import bodyParser from "body-parser";
import { addCustomer } from "./controllers/customersController";
import { addItem } from "./controllers/itemsController"; // Import the addItem function

const app: Express = express();
const port = 3000;

app.use(bodyParser.json());

// Customer route
app.post("/add-customer", addCustomer);

// Item route
app.post("/add-item", addItem); // Add a route for adding items

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
