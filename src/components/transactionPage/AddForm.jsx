import { useState } from "react";
import PropTypes from "prop-types";
import { DATA_YEARS } from "../../data/years";
import { DATA_MONTHS } from "../../data/months";

const AddForm = ({ onAdd, onCancel }) => {
    const [newMonth, setNewMonth] = useState("");
    const [newYear, setNewYear] = useState("");
    const [newPoints, setNewPoints] = useState("");

    const handleAdd = (e) => {
        e.preventDefault();
        if (newMonth && newYear && newPoints > 0) {
            const monthYear = `${newMonth} ${newYear}`;
            onAdd(monthYear, Number(newPoints));
            setNewMonth("");
            setNewYear("");
            setNewPoints("");
        }
    };

    return (
        <form className="add-form" onSubmit={handleAdd}>
            <select
                value={newMonth}
                onChange={(e) => setNewMonth(e.target.value)}
                required
            >
                <option value="">Select Month</option>
                {DATA_MONTHS.map((month) => (
                    <option key={month} value={month}>
                        {month}
                    </option>
                ))}
            </select>

            <select
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                required
            >
                <option value="">Select Year</option>
                {DATA_YEARS.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            <input
                type="number"
                placeholder="Amount"
                value={newPoints}
                onChange={(e) => setNewPoints(e.target.value)}
                required
            />

            <button type="submit">Add</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

AddForm.propTypes = {
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default AddForm;

