const express = require("express");
const router = express.Router();
const datapool = require("../config/datapool");

//Get all Rewards
router.get("/", async (req, res) => {
    try {
        const [rows] = await datapool.query("SELECT * FROM rewards");
        res.json(rows);
    } catch (err) {
        console.error("[API] Get rewards error:", err);
        res.status(500).json({ error: "Failed to fetch rewards" });
    }
});

module.exports = router;
