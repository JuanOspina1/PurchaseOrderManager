import Wrapper from "../middlewear/Wrapper";
import AuthenticatedOnly from "../middlewear/AuthenticatedOnly";
import {
	EditMainCompany,
	GetMainCompany,
} from "../controllers/main_company.controller";

const express = require("express");
const Router = express.Router();

Router.route("/")
	.get(AuthenticatedOnly, Wrapper(GetMainCompany))
	.patch(AuthenticatedOnly, Wrapper(EditMainCompany));

export default Router;
