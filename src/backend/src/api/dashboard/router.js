import express from "express";
import { verifyToken } from "../../middleware/auth.js";
import { getDashboardData, getClientDashboard } from "./controller.js";

const router = express.Router();

// Admin
router.get("/", verifyToken, getDashboardData);

// Cliente
router.get("/cliente", verifyToken, getClientDashboard);

export default router;
