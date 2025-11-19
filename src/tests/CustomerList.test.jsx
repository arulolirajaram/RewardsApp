import React from "react";
import { render, screen } from "@testing-library/react";
import CustomerList from "../components/TransactionPage/CustomerList";

describe("CustomerList Component", () => {
    const mockCustomers = [
        {
            id: 1,
            monthlyRewards: { "Jan 2025": 40 },
            totalRewards: 40,
        },
        {
            id: 2,
            monthlyRewards: { "Feb 2025": 60 },
            totalRewards: 60,
        },
    ];

    test("renders customer cards", () => {
        render(
            <CustomerList
                customers={mockCustomers}
                selectedMonth="All"
                selectedYear="All"
            />
        );

        expect(screen.getByText(/Customer ID: 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Customer ID: 2/i)).toBeInTheDocument();
    });
});
