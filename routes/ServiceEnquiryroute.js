import express from "express";
import { createServiceEnquiry } from "../controller/ServiceEnquiryController.js";

const router = express.Router();

router.post("/create", createServiceEnquiry);

export default router;