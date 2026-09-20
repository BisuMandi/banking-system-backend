import { LedgerModel } from "../models/ledger.model.js";

/**
 * Calculates the account balance from its ledger entries.
 *
 * @param {mongoose.Types.ObjectId} accountId - Account ID.
 * @param {mongoose.ClientSession} session - MongoDB transaction session.
 * @returns {Promise<number>} Account balance.
 */
export const getAccountBalance = async (accountId, session = null) => {
    const result = await LedgerModel.aggregate([
        {
            $match: {
                account: accountId
            }
        },
        {
            $group: {
                _id: "$account",
                balance: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            { $multiply: ["$amount", -1] }
                        ]
                    }
                }
            }
        }
    ]).session(session);

    return result[0]?.balance ?? 0;
};