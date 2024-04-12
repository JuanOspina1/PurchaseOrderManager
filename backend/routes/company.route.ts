import Wrapper from "../middlewear/Wrapper";
import AuthenticatedOnly from "../middlewear/AuthenticatedOnly";
import {
	CreateCompany,
	DeleteCompany,
	EditCompany,
	GetCompanies,
	GetCompany,
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

export default Router;
