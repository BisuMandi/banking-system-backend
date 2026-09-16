import 'dotenv/config';
import { UserModel } from "../models/user.model.js";
import jwt from "jsonwebtoken";


/**
 * Checks if user is logged in
 * - if user is logged in, then pass the request to next controller
 * - else terminate the request
 * @param {*} req 
 * @param {*} res
 * @param {*} next
 * @returns 
 */
export const isUserLoggedIn = async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized, Token is missing",
            status: "failed"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized, Invalid token",
                status: "failed"
            });
        }

        req.user = user;

        next();

    } catch (err) {
        console.error(`Error: ${err}`);

        return res.status(500).json({
            message: err.message,
            status: "failed"
        });
    }
}