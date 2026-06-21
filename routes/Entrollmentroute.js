import { Router} from "express";
const router = Router();

import {createEnrollment } from "../controller/EnrollmentController.js";
import { verifyToken } from "../utils/tokenAuth.js";


router.post("/apply", createEnrollment);

export default router;