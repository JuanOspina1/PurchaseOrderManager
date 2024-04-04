import { Express } from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";

const Routes = (app: Express) => {
	app.use("/", authRouter);
	app.use("/customer", userRouter);
};

export default Routes;
