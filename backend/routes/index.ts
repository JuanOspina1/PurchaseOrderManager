import { Express } from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";
import companyRouter from "./company.route.js";
// import mainCompanyRouter from "./main_company.route.js";

const Routes = (app: Express) => {
	app.use("/", authRouter);
	app.use("/user", userRouter);
	app.use("/company", companyRouter);
	// app.use("/m_company", mainCompanyRouter);
};

export default Routes;
