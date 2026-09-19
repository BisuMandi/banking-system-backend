import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Ledger must be associated with an account"],
        index: true,
        immutable: true
    },

    amount: {
        type: Number,
        required: [true, "Amount is required to create a ledger"],
        min: [0.01, "Amount must be greater than zero"],
        immutable: true
    },

    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: [true, "Ledger must be associated with a transaction"],
        index: true,
        immutable: true
    },

    type: {
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "Type can be either CREDIT or DEBIT",
        },
        required: [true, "Type of ledger is required"],
        immutable: true
    }
});

function preventLedgerModification() {
    throw new Error("Ledger entries are read-only and cannot be modified or deleted");
}

ledgerSchema.pre("updateOne", { query: true, document: true }, preventLedgerModification);
ledgerSchema.pre("updateMany", preventLedgerModification);

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
ledgerSchema.pre("findByIdAndUpdate", preventLedgerModification);
ledgerSchema.pre("replaceOne", preventLedgerModification);

ledgerSchema.pre("deleteOne", { query: true, document: true }, preventLedgerModification);
ledgerSchema.pre("deleteMany", preventLedgerModification);

ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findByIdAndDelete", preventLedgerModification);

export const LedgerModel = mongoose.model("Ledger", ledgerSchema);
