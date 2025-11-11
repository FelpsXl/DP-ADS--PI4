import express from "express";
import { getClientDashboardData } from "./controller.js";
import { verifyToken } from "../../middleware/auth.js";

const router = express.Router();

// ✅ protegida com verifyToken
router.get("/", verifyToken, getClientDashboardData);

export default router;
