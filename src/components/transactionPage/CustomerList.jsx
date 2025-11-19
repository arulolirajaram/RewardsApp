import React from "react";
import CustomerCard from "./CustomerCard";
import PropTypes from "prop-types";
import "../../styles/CustomerList.css";

const CustomerList = ({ customers, onUpdate, onDelete }) => {
    return (
        <div className="customer-list-container">
            {customers.map((customer) => (
                <CustomerCard
                    key={customer.id}
                    customer={customer || []}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

CustomerList.propTypes = {
    customers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            monthlyRewards: PropTypes.objectOf(
                PropTypes.oneOfType([PropTypes.number, PropTypes.string])
            ).isRequired,
            totalRewards: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        })
    ).isRequired,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
};


export default CustomerList;
