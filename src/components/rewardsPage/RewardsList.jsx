import React from "react";
import Rewardscard from "./Rewardscard";
import PropTypes from "prop-types";
import "../../styles/CustomerList.css";

const CustomerList = ({ customers, onUpdate, onDelete, selectedMonth, selectedYear }) => {
    return (
        <div className="customer-list-container">
            {customers.map((customer) => (
                <Rewardscard
                    key={customer.id}
                    customer={customer}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                />
            ))}
        </div>
    );
};

CustomerList.propTypes = {
    customers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            monthlyRewards: PropTypes.objectOf(PropTypes.number).isRequired,
            totalRewards: PropTypes.number.isRequired,
        })
    ).isRequired,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    selectedMonth: PropTypes.string,
    selectedYear: PropTypes.string,
};

export default CustomerList;

