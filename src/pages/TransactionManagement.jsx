// src/pages/RewardsManagement.js
import React, { useState, useEffect } from "react";
import CustomerList from "../components/transactionPage/CustomerList";
import {
    fetchTransactions,
    addCustomer,
    upsertTransaction,
    deleteTransaction
} from "../api";
import { processTransactions } from "../helpers/transactionProcessor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DATA_MONTHS } from "../data/months";
import ConsoleLog from "../helpers/ConsoleLogger";

/**
 * Component for managing customer transactions.
 * Allows adding new customers, updating and deleting transactions.
 * @returns {JSX.Element} The transaction management page.
 */
const TransactionManagement = () => {
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);

    // New Customer Form
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
    const [newCustomerId, setNewCustomerId] = useState("");
    const [newCustomerRewards, setNewCustomerRewards] = useState({
        monthYear: "",
        points: "",
    });

    // Month-Year dropdowns
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear + 1];
    const monthYearOptions = years.flatMap((year) =>
        DATA_MONTHS.map((m) => `${m} ${year}`)
    );

    // Load data if not already loaded
    useEffect(() => {
        /**
         * Loads transaction data from the API and processes it for display.
         */
        const loadData = async () => {
            try {
                const transactions = await fetchTransactions();
                const processed = processTransactions(transactions);
                ConsoleLog.log("[UI] Fetched transactions:", processed);

                setCustomers(processed);

                toast.success("Data loaded from database!");
            } catch (err) {
                ConsoleLog.error("[UI] Failed to load transactions:", err);
                toast.error("Failed to load transactions.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // ADD Customer
    const handleAddCustomer = async () => {
        const idNum = Number(newCustomerId);

        if (!idNum || !newCustomerRewards.monthYear || !newCustomerRewards.points) {
            toast.warning("Please fill all fields.");
            return;
        }

        if (customers.some((c) => c.id === idNum)) {
            toast.error(`Customer ${idNum} already exists.`);
            return;
        }

        try {
            // Add to backend
            await addCustomer(idNum);
            await upsertTransaction(idNum, newCustomerRewards.monthYear, Number(newCustomerRewards.points));

            // Update shared state for instant UI
            const newCustomer = {
                id: idNum,
                monthlyRewards: { [newCustomerRewards.monthYear]: Number(newCustomerRewards.points) },
                totalRewards: Number(newCustomerRewards.points),
            };
            setCustomers((prev) => [...prev, newCustomer]);

            toast.success(`Customer ${idNum} added successfully!`);
            setShowNewCustomerForm(false);
            setNewCustomerId("");
            setNewCustomerRewards({ monthYear: "", points: "" });
        } catch (err) {
            ConsoleLog.error("[UI] Add customer failed:", err);
            toast.error("Failed to save to database.");
        }
    };

    // UPDATE Reward
    const handleUpdate = async (customerId, monthYear, points) => {
        try {
            await upsertTransaction(customerId, monthYear, points);
            setCustomers((prev) =>
                prev.map((c) =>
                    c.id === customerId
                        ? {
                            ...c,
                            monthlyRewards: { ...c.monthlyRewards, [monthYear]: points },
                            totalRewards: Object.values({ ...c.monthlyRewards, [monthYear]: points }).reduce((sum, p) => sum + p, 0),
                        }
                        : c
                )
            );
            toast.success("Reward updated successfully!");
        } catch (err) {
            ConsoleLog.error("[UI] Update failed:", err);
            toast.error("Failed to update reward.");
        }
    };

    // DELETE Reward
    const handleDelete = async (customerId, monthYear) => {
        try {
            await deleteTransaction(customerId, monthYear);
            setCustomers((prev) =>
                prev.map((c) =>
                    c.id === customerId
                        ? {
                            ...c,
                            monthlyRewards: Object.fromEntries(
                                Object.entries(c.monthlyRewards).filter(([m]) => m !== monthYear)
                            ),
                            totalRewards: Object.values(
                                Object.fromEntries(
                                    Object.entries(c.monthlyRewards).filter(([m]) => m !== monthYear)
                                )
                            ).reduce((sum, p) => sum + p, 0),
                        }
                        : c
                )
            );
            toast.success("Reward deleted!");
        } catch (err) {
            ConsoleLog.error("[UI] Delete failed:", err);
            toast.error("Failed to delete reward.");
        }
    };

    if (loading)
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <img
                    src="/web-5811_128.gif"
                    alt="Loading..."
                    style={{
                        width: "120px",
                        height: "120px",
                        marginBottom: "15px",
                        borderRadius: "8px",
                    }}
                />
                <p>Loading data...</p>
            </div>
        );

    return (
        <div className="page-container">
            <h2>Transaction Management (MySQL)</h2>

            {!showNewCustomerForm ? (
                <button onClick={() => setShowNewCustomerForm(true)}>➕ Add New Transactions</button>
            ) : (
                <div className="new-customer-form">
                    <h3>Add New Transactions</h3>
                    <input
                        type="number"
                        placeholder="Customer ID"
                        value={newCustomerId}
                        onChange={(e) => setNewCustomerId(e.target.value)}
                    />
                    <select
                        value={newCustomerRewards.monthYear}
                        onChange={(e) =>
                            setNewCustomerRewards({ ...newCustomerRewards, monthYear: e.target.value })
                        }
                    >
                        <option value="">Select Month-Year</option>
                        {monthYearOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newCustomerRewards.points}
                        onChange={(e) =>
                            setNewCustomerRewards({ ...newCustomerRewards, points: e.target.value })
                        }
                    />
                    <button onClick={handleAddCustomer}>Save</button>
                    <button onClick={() => setShowNewCustomerForm(false)}>Cancel</button>
                </div>
            )}

            <CustomerList customers={customers} onUpdate={handleUpdate} onDelete={handleDelete} />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default TransactionManagement;
