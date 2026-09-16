import { AccountModel } from "../models/account.model.js";

/**
 * Creates an account
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const createAccount = async (req, res) => {
    const { _id } = req.user;
    const { currency } = req.body;

    try {
        const newAccount = await AccountModel.create({
            user: _id,
            currency
        });

        return res.status(201).json({
            message: "Account created successfully",
            status: "success",
            newAccount
        });

    } catch (err) {
        console.error(`Error: ${err}`);

        return res.status(500).json({
            message: err.message,
            status: "failed"
        });
    }
}