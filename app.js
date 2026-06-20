

import express from "express";
import cors from "cors";
import helmet from "helmet";
const app = express();
import Conversationroute from "./routes/Conversationroute.js"
import CustomerSupport from "./routes/CustomerSupportroute.js"
import Enrollment from "./controller/Enrollment.js"

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use("/api/v1/conversation",Conversationroute);
app.use("/api/v1/enrollment",Enrollment);
app.use("/api/v1/customersupport",CustomerSupport)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;