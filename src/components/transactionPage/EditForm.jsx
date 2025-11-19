import React, { useState } from "react";
import PropTypes from "prop-types";

const EditForm = ({ value, onSave, onCancel }) => {
    const [editPoints, setEditPoints] = useState(value ?? "");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editPoints > 0) {
            onSave(Number(editPoints));
        }
    };

    return (
        <form className="edit-form" onSubmit={handleSubmit}>
            <input
                type="number"
                value={editPoints ?? ""}
                onChange={(e) => setEditPoints(e.target.value)}
                placeholder="Enter amount"
                required
            />
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

EditForm.propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default EditForm;
