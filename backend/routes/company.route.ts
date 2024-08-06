import Wrapper from "../middlewear/Wrapper";
import AuthenticatedOnly from "../middlewear/AuthenticatedOnly";
import { EditCompany, GetCompany } from "../controllers/company.controller";
import adminOnly from "../middlewear/adminOnly";

const express = require("express");
const Router = express.Router();

// Router.route("/").post(AuthenticatedOnly, adminOnly, Wrapper(CreateCompany));

Router.route("/")
	.get(AuthenticatedOnly, Wrapper(GetCompany))
	.patch(AuthenticatedOnly, adminOnly, Wrapper(EditCompany));

export default Router;
