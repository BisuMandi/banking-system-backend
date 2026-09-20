import express from "express";
import authRoutes from "./routes/auth.routes.js";
import accountRoutes from "./routes/account.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());

app.use(cookieParser());

// for authentication 
app.use("/api/auth", authRoutes);
 
// for accounts
app.use("/api/accounts", accountRoutes);

// for transactions
app.use("/api/transactions", transactionRoutes);
