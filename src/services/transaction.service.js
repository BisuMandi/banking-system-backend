import mongoose from "mongoose";

import { AccountModel } from "../models/account.model.js";
import { TransactionModel } from "../models/transaction.model.js";
import { LedgerModel } from "../models/ledger.model.js";

import { getAccountBalance } from "./account.service.js";

export const createTransactionService = async ({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey
}) => {
    if (fromAccount === toAccount) {
        throw new Error(
            "Sender and receiver accounts must be different"
        );
    }

    const session = await mongoose.startSession();

    try {
        let result;

        await session.withTransaction(async () => {

            // Check idempotency key inside the transaction
            const existingTransaction =
                await TransactionModel.findOne({
                    idempotencyKey
                }).session(session);

            if (existingTransaction) {
                result = {
                    existing: true,
                    transaction: existingTransaction
                };

                return;
            }

            // Find both accounts inside the transaction
            const senderAccount = await AccountModel.findById(
                fromAccount
            ).session(session);

            const receiverAccount = await AccountModel.findById(
                toAccount
            ).session(session);

            if (!senderAccount || !receiverAccount) {
                throw new Error(
                    "fromAccount or toAccount is invalid"
                );
            }

            // Check account status
            if (
                senderAccount.status !== "ACTIVE" ||
                receiverAccount.status !== "ACTIVE"
            ) {
                throw new Error(
                    "Both fromAccount and toAccount must be ACTIVE to process transaction"
                );
            }

            // Calculate sender balance inside transaction
            const senderBalance = await getAccountBalance(
                senderAccount._id,
                session
            );

            if (senderBalance < amount) {
                throw new Error(
                    `Insufficient balance. Current balance: ${senderBalance}. Requested amount: ${amount}`
                );
            }

            /*
             * Touch both account documents.
             *
             * This creates a write conflict if another transaction
             * is simultaneously modifying the same account.
             */
            await AccountModel.updateOne(
                { _id: senderAccount._id },
                {
                    $inc: {
                        transactionVersion: 1
                    }
                },
                { session }
            );

            await AccountModel.updateOne(
                { _id: receiverAccount._id },
                {
                    $inc: {
                        transactionVersion: 1
                    }
                },
                { session }
            );

            // Create transaction
            const [transaction] = await TransactionModel.create(
                [
                    {
                        fromAccount,
                        toAccount,
                        amount,
                        idempotencyKey,
                        status: "PENDING"
                    }
                ],
                { session }
            );

            // Create DEBIT ledger
            await LedgerModel.create(
                [
                    {
                        account: fromAccount,
                        amount,
                        type: "DEBIT",
                        transaction: transaction._id
                    }
                ],
                { session }
            );

            // Create CREDIT ledger
            await LedgerModel.create(
                [
                    {
                        account: toAccount,
                        amount,
                        type: "CREDIT",
                        transaction: transaction._id
                    }
                ],
                { session }
            );

            // Mark transaction as completed
            transaction.status = "COMPLETED";

            await transaction.save({ session });

            result = {
                existing: false,
                transaction
            };
        });

        return result;

    } finally {
        await session.endSession();
    }
};