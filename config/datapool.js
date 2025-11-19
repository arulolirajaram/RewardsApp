const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const datapool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "rewards_app",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

datapool.getConnection()
    .then(conn => {
        console.log("MySQL pool connected successfully!");
        conn.release();
    })
    .catch(err => {
        console.error("MySQL pool connection failed:", err.message);
    });

module.exports = datapool;
