import React, { useState } from "react";
import PropTypes from "prop-types";
import { DATA_MONTHS as Months } from "../../data/months";
import "../../styles/CustomerCard.css";

const Rewardscard = ({
    customer = {},
    onUpdate,
    onDelete,
    selectedMonth = "All",
    selectedYear = "All",
}) => {
    const { id = "N/A", monthlyRewards = {} } = customer;
    const months = Object.keys(monthlyRewards);

    const monthOrder = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
    };

    const sortedMonths = [...months].sort((a, b) => {
        const [monthA] = a.split(" ");
        const [monthB] = b.split(" ");

        return monthOrder[monthA] - monthOrder[monthB];
    });

    /* To list the latest three rewards */
    const lastThreeMonths = sortedMonths.slice(-3);

    /* Apply filter */
    const filteredMonths = lastThreeMonths.filter((monthYear) => {
        const [month, year] = monthYear.split(" ");
        return (
            (selectedMonth === "All" || month === selectedMonth) &&
            (selectedYear === "All" || year === selectedYear)
        );
    });

    const filteredMonthsAll = months.filter((monthYear) => {
        const [month, year] = monthYear.split(" ");
        return (
            (selectedMonth === "All" || month === selectedMonth) &&
            (selectedYear === "All" || year === selectedYear)
        );
    });

    /* --- STATE --- */
    const [isEditing, setIsEditing] = useState(false);
    const [editMonth, setEditMonth] = useState("");
    const [editPoints, setEditPoints] = useState(0);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newMonth, setNewMonth] = useState("");
    const [newYear, setNewYear] = useState("");
    const [newPoints, setNewPoints] = useState(0);

    // --- SAVE EDIT ---
    const handleSaveEdit = () => {
        if (!editMonth || editPoints <= 0) return;

        onUpdate?.(id, editMonth, Number(editPoints));
        setIsEditing(false);
    };

    // --- ADD NEW REWARD ---
    const handleAddReward = () => {
        if (!newMonth || !newYear || newPoints <= 0) return;

        const monthYear = `${newMonth} ${newYear}`;
        onUpdate?.(id, monthYear, Number(newPoints));

        setNewMonth("");
        setNewYear("");
        setNewPoints(0);
        setShowAddForm(false);
    };

    // --- DELETE REWARD ---
    const handleDeleteReward = (month) => {
        if (!month) return;
        onDelete?.(id, month);
    };

    // --- TOTAL POINTS ---
    const totalPoints = filteredMonthsAll.reduce(
        (a, m) => a + monthlyRewards[m],
        0
    );

    return (
        <div className="customer-card">
            <h3>Customer ID: {id}</h3>

            {/* --- MONTHLY REWARDS (Only recent 3 transactions) --- */}
            <div className="rewards-details">
                <h4>Recent 3 Rewards:</h4>

                {filteredMonths.length === 0 ? (
                    <p style={{ color: "gray" }}>No recent rewards found</p>
                ) : (
                    <ul>
                        {filteredMonths.map((month) => (
                            <li key={month}>
                                <strong>{month}:</strong> {monthlyRewards[month]} points{" "}
                                {onUpdate && (
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setEditMonth(month);
                                            setEditPoints(monthlyRewards[month]);
                                        }}
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button onClick={() => handleDeleteReward(month)}>
                                        Delete
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* --- EDIT FORM --- */}
            {isEditing && (
                <div className="edit-form">
                    <input
                        type="number"
                        value={editPoints}
                        onChange={(e) => setEditPoints(e.target.value)}
                    />
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            )}

            {/* --- TOTAL POINTS --- */}
            <div className="total-rewards">
                <h4>Total Reward Points : {totalPoints}</h4>
            </div>

            {/* --- ADD NEW REWARD --- */}
            {onUpdate &&
                (showAddForm ? (
                    <div className="add-form">
                        <select
                            value={newMonth}
                            onChange={(e) => setNewMonth(e.target.value)}
                        >
                            <option value="">Select Month</option>
                            {Months.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            placeholder="Year (e.g., 2025)"
                            value={newYear}
                            onChange={(e) => setNewYear(e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Points"
                            value={newPoints}
                            onChange={(e) => setNewPoints(e.target.value)}
                        />

                        <button onClick={handleAddReward}>Add</button>
                        <button onClick={() => setShowAddForm(false)}>Cancel</button>
                    </div>
                ) : (
                    <button onClick={() => setShowAddForm(true)}>Add New Reward</button>
                ))}
        </div>
    );
};

Rewardscard.propTypes = {
    customer: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        monthlyRewards: PropTypes.objectOf(PropTypes.number),
        totalRewards: PropTypes.number,
    }),
    selectedMonth: PropTypes.string,
    selectedYear: PropTypes.string,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
};

export default Rewardscard;
