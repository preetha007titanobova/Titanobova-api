import { Router} from "express";
const router = Router();
import {createCustomerSupport } from "../controller/CustomerSupportcontroller.js";
import { verifyToken } from "../utils/tokenAuth.js";



router.post("/create", createCustomerSupport);

export default router;