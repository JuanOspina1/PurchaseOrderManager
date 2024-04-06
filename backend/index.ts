import { ErrorHandler } from "./middlewear/ErrorHandler.js";
import Routes from "./routes/index.js";
const express = require("express");
require("dotenv").config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
Routes(app);

app.use(ErrorHandler);

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});
