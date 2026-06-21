import { Router} from "express";
const router = Router();

import {applyIntern} from "../controller/internApplyController.js";
import { verifyToken } from "../utils/tokenAuth.js";

console.log("Intern Route Loaded");
router.post("/apply", applyIntern);


export default router;