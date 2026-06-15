import { Router} from "express";
const router = Router();
import { createConversation} from "../controller/Conversationcontroller.js";
import { verifyToken } from "../utils/tokenAuth.js";



router.post("/create", createConversation);

export default router;