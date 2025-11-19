const express = require("express");
const router = express.Router();
const datapool = require("../config/datapool");
const calculatePoints = require("../utils/calculatePoints");

/**
 * Retrieves all transactions from the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.get("/", async (req, res) => {
    try {
        const [rows] = await datapool.query("SELECT * FROM transactions");
        res.json(rows);
    } catch (err) {
        console.error("[API] Get transactions error:", err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// UPSERT transaction + rewards
/**
 * Inserts or updates a transaction and its associated rewards.
 * If a transaction exists for the customer in the given month, it updates the purchase amount.
 * Otherwise, it creates a new transaction. Then, it calculates and updates rewards accordingly.
 * @param {Object} req - Express request object containing customerId, monthYear, purchaseAmount.
 * @param {Object} res - Express response object.
 */
router.post("/upsert", async (req, res) => {
    console.log("Request body:", req.body);
    const { customerId, monthYear, purchaseAmount } = req.body;

    if (!purchaseAmount) {
        return res.status(400).json({ error: "purchaseAmount is required" });
    }

    try {
        const [month, year] = monthYear.split(" ");
        const monthNum = ("0" + (new Date(`${month} 1`).getMonth() + 1)).slice(-2);
        const date = `${year}-${monthNum}-01`;

        const [existing] = await datapool.query(
            "SELECT * FROM transactions WHERE customerId = ? AND purchaseDate LIKE ?",
            [customerId, `${year}-${monthNum}%`]
        );

        let transactionId;

        if (existing.length > 0) {
            await datapool.query(
                "UPDATE transactions SET purchaseAmount = ? WHERE id = ?",
                [purchaseAmount, existing[0].id]
            );
            transactionId = existing[0].id;
        } else {
            const [result] = await datapool.query(
                "INSERT INTO transactions (customerId, purchaseAmount, purchaseDate) VALUES (?, ?, ?)",
                [customerId, purchaseAmount, date]
            );
            transactionId = result.insertId;
        }

        const rewardPoints = calculatePoints(purchaseAmount);

        const [existingReward] = await datapool.query(
            "SELECT * FROM rewards WHERE transactionId = ?",
            [transactionId]
        );

        if (existingReward.length > 0) {
            await datapool.query(
                "UPDATE rewards SET rewardPoints = ?, purchaseAmount = ?, createdAt = ? WHERE transactionId = ?",
                [rewardPoints, purchaseAmount, date, transactionId]
            );
        } else {
            await datapool.query(
                "INSERT INTO rewards (transactionId, customerId, rewardPoints, purchaseAmount, createdAt) VALUES (?, ?, ?, ?, ?)",
                [transactionId, customerId, rewardPoints, purchaseAmount, date]
            );
        }

        const [total] = await datapool.query(
            "SELECT SUM(rewardPoints) AS total FROM rewards WHERE customerId = ?",
            [customerId]
        );

        await datapool.query(
            "UPDATE customers SET totalRewards = ? WHERE customerId = ?",
            [total[0].total || 0, customerId]
        );

        res.json({
            success: true,
            message: "Reward upserted successfully",
            transactionId,
            rewardPoints,
            totalRewards: total[0].total || 0,
        });
    } catch (err) {
        console.error("[API] Upsert reward error:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE reward
router.delete("/delete", async (req, res) => {
    const { customerId, monthYear } = req.body;

    try {
        const [month, year] = monthYear.split(" ");
        const monthNum = ("0" + (new Date(`${month} 1`).getMonth() + 1)).slice(-2);

        const [existing] = await datapool.query(
            "SELECT * FROM transactions WHERE customerId = ? AND purchaseDate LIKE ?",
            [customerId, `${year}-${monthNum}%`]
        );

        if (existing.length === 0) {
            return res.json({ deleted: false, message: "No transaction found" });
        }

        const transactionId = existing[0].id;

        await datapool.query(
            "DELETE FROM rewards WHERE transactionId = ?",
            [transactionId]
        );

        await datapool.query(
            "DELETE FROM transactions WHERE id = ?",
            [transactionId]
        );

        res.json({ deleted: true, message: "Transaction & reward deleted" });
    } catch (err) {
        console.error("[API] Delete reward error:", err);
        res.status(500).json({
            error: "Failed to delete reward",
            details: err.message,
        });
    }
});


module.exports = router;
