import express from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware.js";
import { createTransaction } from "../controllers/transaction.controller.js";


const router = express.Router();

/**
 * POST api/transactions
 * - protected route
 * - creates a new transaction
 */
router.post("/", isUserLoggedIn, createTransaction);

export default router;