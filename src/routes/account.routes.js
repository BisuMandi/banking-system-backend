import express from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware.js";
import { createAccount } from "../controllers/account.controller.js";

const router = express.Router();

/**
 * POST api/accounts
 * - protected route
 * - creates a new account
 */
router.post("/", isUserLoggedIn, createAccount);

export default router;