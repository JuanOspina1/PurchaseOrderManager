import { ErrorHandler } from "./middlewear/ErrorHandler.js";
import Routes from "./routes/index.js";
import cors from "cors";
const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
		maxAge: 3600,
	})
);
app.use(express.json());
app.use(cookieParser());
Routes(app);

app.use(ErrorHandler);

app.listen(PORT, () => {
	console.log("Server is running on port " + PORT);
});
