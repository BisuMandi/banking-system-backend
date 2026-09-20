import { createTransactionService } from "../services/transaction.service.js";

export const createTransaction = async (req, res) => {
    const {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey
    } = req.body;

    if (
        !fromAccount ||
        !toAccount ||
        amount == null ||
        !idempotencyKey
    ) {
        return res.status(400).json({
            message:
                "fromAccount, toAccount, amount, and idempotencyKey are required",
            status: "failed"
        });
    }

    try {
        const result = await createTransactionService({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey
        });

        if (result.existing) {
            return res.status(200).json({
                message: "Transaction already processed",
                status: "success",
                transaction: result.transaction
            });
        }

        return res.status(201).json({
            message: "Transaction completed successfully",
            status: "success",
            transaction: result.transaction
        });

    } catch (err) {
        console.error("Error:", err);

        return res.status(400).json({
            message: err.message,
            status: "failed"
        });
    }
};