import React, { useReducer } from "react";
import PropTypes from "prop-types";
import "../../styles/CustomerCard.css";
import EditForm from "./EditForm";
import AddForm from "./AddForm";
import { customerCardReducer, initialState, ACTIONS } from "../../reducers/CustomerCardReducer";

const CustomerCard = ({
    customer = {},
    onUpdate,
    onDelete,
    selectedMonth = "All",
    selectedYear = "All"
}) => {
    const { id = "N/A", monthlyRewards: transactionRecords = {} } = customer;

    const [state, dispatch] = useReducer(customerCardReducer, initialState);

    /** SORT MONTHS PROPERLY */
    const sortedMonths = Object.keys(transactionRecords).sort(
        (a, b) => new Date(a) - new Date(b)
    );

    /** APPLY FILTERS (IMPORTANT) */
    const filteredMonths = sortedMonths.filter((monthYear) => {
        const [month, year] = monthYear.split(" ");

        const matchesMonth = selectedMonth === "All" || selectedMonth === month;
        const matchesYear = selectedYear === "All" || selectedYear === year;

        return matchesMonth && matchesYear;
    });

    /** Start editing a transaction */
    const handleStartEdit = (monthYear) => {
        dispatch({
            type: ACTIONS.START_EDIT,
            payload: {
                month: monthYear,
                points: Number(transactionRecords[monthYear])
            }
        });
    };

    /** Save edited amount */
    const handleSaveEdit = (updatedAmount) => {
        onUpdate?.(id, state.editMonth, updatedAmount);
        dispatch({ type: ACTIONS.CANCEL_EDIT });
    };

    /** Delete transaction */
    const handleDeleteTransaction = (monthYear) => {
        onDelete?.(id, monthYear);
    };

    /** Add new transaction */
    const handleAddTransaction = (monthYear, amount) => {
        onUpdate?.(id, monthYear, Number(amount));
        dispatch({ type: ACTIONS.HIDE_ADD_FORM });
    };

    return (
        <div className="customer-card">
            <h3>Customer ID: {id}</h3>

            <div className="rewards-details">
                <h3>Monthly Transactions:</h3>

                {filteredMonths.length === 0 ? (
                    <p>No transactions recorded</p>
                ) : (
                    <ul>
                        {filteredMonths.map((monthYear) => (
                            <li key={monthYear}>
                                <strong>{monthYear}:</strong>{" "}
                                {Number(transactionRecords[monthYear]).toFixed(2)} amount{" "}

                                {!!onUpdate && (
                                    <button onClick={() => handleStartEdit(monthYear)}>
                                        Edit
                                    </button>
                                )}

                                {!!onDelete && (
                                    <button onClick={() => handleDeleteTransaction(monthYear)}>
                                        Delete
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {state.isEditing && (
                <EditForm
                    value={state.editPoints}
                    onSave={handleSaveEdit}
                    onCancel={() => dispatch({ type: ACTIONS.CANCEL_EDIT })}
                />
            )}

            <div className="total-rewards">
                <h3>
                    Total Transactions:{" "}
                    {Object.values(transactionRecords)
                        .reduce((a, b) => a + Number(b), 0)
                        .toFixed(2)}{" "}
                    amount
                </h3>
            </div>

            {onUpdate &&
                (state.showAddForm ? (
                    <AddForm
                        onAdd={handleAddTransaction}
                        onCancel={() => dispatch({ type: ACTIONS.HIDE_ADD_FORM })}
                    />
                ) : (
                    <button onClick={() => dispatch({ type: ACTIONS.SHOW_ADD_FORM })}>
                        Add New Transaction
                    </button>
                ))}
        </div>
    );
};

CustomerCard.propTypes = {
    customer: PropTypes.shape({
        id: PropTypes.number.isRequired,
        monthlyRewards: PropTypes.objectOf(
            PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        ).isRequired,
    }),
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    selectedMonth: PropTypes.string,
    selectedYear: PropTypes.string
};

export default CustomerCard;
