import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Transaction must be associated with a sender's account"],
        index: true
    },

    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Transaction must be associated with a receiver's account"],
        index: true
    },

    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can be either PENDING, COMPLETED, FAILED, or REVERSED"
        },
        default: "PENDING"
    },

    amount: {
        type: Number,
        required: [true, "Transaction must have an amount"],
        min: [0.01, "Transaction amount must be greater than zero"]

    },

    idempotencyKey: {
        type: String,
        required: [true, "A transation must have an idempotancy key"],
        unique: true,
        index: true
    }
}, { timestamps: true });

export const TransactionModel = mongoose.model("Transaction", transactionSchema);