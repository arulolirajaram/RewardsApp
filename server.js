const express = require("express");
const cors = require("cors");
require("dotenv").config();

const transactionsRoute = require("./routes/transactions");
const customersRoute = require("./routes/customers");
const rewardsRoute = require("./routes/rewards");

/**
 * Creates and configures the Express application.
 */
const app = express();
const PORT = 3002;

// Enable CORS for cross-origin requests
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Mount routes for transactions API
app.use("/api/transactions", transactionsRoute);
// Mount routes for customers API
app.use("/api/customers", customersRoute);
// Mount routes for rewards API
app.use("/api/rewards", rewardsRoute);

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
