import express from "express";
import authRoutes from "./routes/auth.routes.js";
import accountRoutes from "./routes/account.routes.js";
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
 
app.use("/api/accounts", accountRoutes);
