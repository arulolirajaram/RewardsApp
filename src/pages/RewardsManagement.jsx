import React, { useEffect, useState } from "react";
import { fetchRewards } from "../api";
import RewardsList from "../components/rewardsPage/RewardsList";
import RewardsFilter from "../components/rewardsPage/RewardFilter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConsoleLog from "../helpers/ConsoleLogger";

const RewardsManagement = () => {
    // State management
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("All");
    const [selectedYear, setSelectedYear] = useState("All");
    const [showOnlyWithRewards, setShowOnlyWithRewards] = useState(false);

    // Load and group rewards on mount
    useEffect(() => {
        const loadRewards = async () => {
            try {
                const data = await fetchRewards();
                ConsoleLog.log("Fetched Rewards Data:", data);

                const grouped = data.reduce((acc, row) => {
                    const { customerId, rewardPoints, createdAt } = row;
                    const date = new Date(createdAt);

                    const monthYear = date.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    });

                    if (!acc[customerId]) {
                        acc[customerId] = {
                            id: customerId,
                            monthlyRewards: {},
                            totalRewards: 0,
                        };
                    }

                    acc[customerId].monthlyRewards[monthYear] =
                        (acc[customerId].monthlyRewards[monthYear] || 0) + rewardPoints;

                    acc[customerId].totalRewards += rewardPoints;

                    return acc;
                }, {});

                setCustomers(Object.values(grouped));
                toast.success("Data loaded from database!");
            } catch (error) {
                ConsoleLog.error("Failed to load rewards:", error);
            } finally {
                setLoading(false);
            }
        };

        loadRewards();
    }, []);

    // Apply filters to customers
    const filteredCustomers = customers.map((customer) => {
        const filteredRewards = {};

        Object.entries(customer.monthlyRewards).forEach(([monthYear, points]) => {
            const [month, year] = monthYear.split(" ");

            if (
                (selectedMonth === "All" || month === selectedMonth) &&
                (selectedYear === "All" || year === selectedYear)
            ) {
                filteredRewards[monthYear] = points;
            }
        });

        return {
            ...customer,
            monthlyRewards: filteredRewards,
            totalRewards: Object.values(filteredRewards).reduce((a, b) => a + b, 0),
        };
    });

    // Optionally show only customers with rewards
    const visibleCustomers = filteredCustomers.filter(
        (c) => !showOnlyWithRewards || c.totalRewards > 0
    );

    // Loading screen
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
        <div className="rewards-container">
            <h2>Customer Rewards</h2>

            <RewardsFilter
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                showOnlyWithRewards={showOnlyWithRewards}
                setShowOnlyWithRewards={setShowOnlyWithRewards}
            />

            {visibleCustomers.length === 0 ? (
                <p>No rewards found for the selected filters.</p>
            ) : (
                <RewardsList customers={visibleCustomers} />
            )}

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
    );
};

export default RewardsManagement;
