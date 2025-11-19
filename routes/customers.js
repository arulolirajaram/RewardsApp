const express = require("express");
const router = express.Router();
const datapool = require("../config/datapool");

router.get("/", async (req, res) => {
    try {
        const [rows] = await datapool.query("SELECT * FROM customers");
        res.json(rows);
    } catch (err) {
        console.error("[API] Get customers error:", err);
        res.status(500).json({ error: "Failed to fetch customers" });
    }
});

router.post("/", async (req, res) => {
    const { customerId } = req.body;

    try {
        const [result] = await datapool.query(
            "INSERT INTO customers (customerId, totalRewards) VALUES (?, 0)",
            [customerId]
        );
        res.json({ success: true, insertId: result.insertId });
    } catch (err) {
        console.error("[API] Add customer error:", err);
        res.status(500).json({ error: "Failed to add customer", details: err.message });
    }
});

module.exports = router;
