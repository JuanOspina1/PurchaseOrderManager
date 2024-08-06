import {
	addCustomerToCustomerCompany,
	createCustomerCompany,
	deleteCustomerCompany,
	getCustomerCompanies,
	getCustomerCompany,
	removeCustomerFromCustomerCompany,
	updateCustomerCompany,
} from "../controllers/customer_company.controller";
import express from "express";
import Wrapper from "../middlewear/Wrapper";
import AuthenticatedOnly from "../middlewear/AuthenticatedOnly";
import adminOnly from "../middlewear/adminOnly";

const Router = express.Router();

Router.route("/")
	.get(AuthenticatedOnly, adminOnly, Wrapper(getCustomerCompanies))
	.post(AuthenticatedOnly, adminOnly, Wrapper(createCustomerCompany));

Router.route("/:id")
	.get(AuthenticatedOnly, Wrapper(getCustomerCompany))
	.patch(AuthenticatedOnly, adminOnly, Wrapper(updateCustomerCompany))
	.delete(AuthenticatedOnly, adminOnly, Wrapper(deleteCustomerCompany));

Router.route("/addCustomer/:id").post(
	AuthenticatedOnly,
	adminOnly,
	Wrapper(addCustomerToCustomerCompany)
);
Router.route("/removeCustomer/:id").post(
	AuthenticatedOnly,
	adminOnly,
	Wrapper(removeCustomerFromCustomerCompany)
);

export default Router;
