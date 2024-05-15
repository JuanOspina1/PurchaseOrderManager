import Wrapper from "../middlewear/Wrapper";
import AuthenticatedOnly from "../middlewear/AuthenticatedOnly";
import {
	AddCustomersToCompany,
	CreateCompany,
	DeleteCompany,
	EditCompany,
	GetCompanies,
	GetCompany,
	RemoveCustomersFromCompany,
} from "../controllers/company.controller";

const express = require("express");
const Router = express.Router();

Router.route("/")
	.get(AuthenticatedOnly, Wrapper(GetCompanies))
	.post(AuthenticatedOnly, Wrapper(CreateCompany));

Router.route("/:id")
	.get(AuthenticatedOnly, Wrapper(GetCompany))
	.patch(AuthenticatedOnly, Wrapper(EditCompany))
	.delete(AuthenticatedOnly, Wrapper(DeleteCompany));

Router.route("/:id/customers")
	.post(AuthenticatedOnly, Wrapper(AddCustomersToCompany))
	.delete(AuthenticatedOnly, Wrapper(RemoveCustomersFromCompany));

export default Router;
