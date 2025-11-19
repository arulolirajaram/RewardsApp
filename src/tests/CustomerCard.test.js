import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomerCard from "../components/transactionPage/CustomerCard";

const mockCustomer = {
    id: 1,
    monthlyRewards: {
        "January 2025": 120,
        "February 2025": 200
    }
};

describe("CustomerCard Component", () => {
    test("renders customer ID", () => {
        render(<CustomerCard customer={mockCustomer} />);
        expect(screen.getByText("Customer ID: 1")).toBeInTheDocument();
    });

    test("starts edit mode", () => {
        render(<CustomerCard customer={mockCustomer} onUpdate={() => { }} />);

        fireEvent.click(screen.getAllByText("Edit")[0]);

        expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    });

    test("saves edited points", () => {
        const onUpdate = jest.fn();
        render(<CustomerCard customer={mockCustomer} onUpdate={onUpdate} />);

        fireEvent.click(screen.getAllByText("Edit")[0]);

        fireEvent.change(screen.getByRole("spinbutton"), {
            target: { value: "150" }
        });

        fireEvent.click(screen.getByText("Save"));

        expect(onUpdate).toHaveBeenCalledWith(1, "January 2025", 150);
    });

    test("deletes a transaction", () => {
        const onDelete = jest.fn();
        render(<CustomerCard customer={mockCustomer} onDelete={onDelete} />);

        fireEvent.click(screen.getAllByText("Delete")[0]);

        expect(onDelete).toHaveBeenCalledWith(1, "January 2025");
    });

    test("adds a new transaction", () => {
        const onUpdate = jest.fn();
        render(<CustomerCard customer={mockCustomer} onUpdate={onUpdate} />);

        fireEvent.click(screen.getByText("Add New Transaction"));

        fireEvent.change(screen.getAllByRole("combobox")[0], {
            target: { value: "March" }
        });

        fireEvent.change(screen.getAllByRole("combobox")[1], {
            target: { value: "2025" }
        });

        fireEvent.change(screen.getByPlaceholderText("Amount"), {
            target: { value: "300" }
        });

        fireEvent.click(screen.getByText("Add"));

        expect(onUpdate).toHaveBeenCalledWith(1, "March 2025", 300);
    });

    test("filters by month and year", () => {
        render(
            <CustomerCard
                customer={mockCustomer}
                selectedMonth="January"
                selectedYear="2025"
            />
        );

        // Match partial text because DOM contains "January 2025 :" with spaces
        expect(
            screen.getByText((text) => text.includes("January 2025"))
        ).toBeInTheDocument();

        // Match partial "120.00" because DOM has "120.00 amount"
        expect(
            screen.getByText((text) => text.includes("120.00"))
        ).toBeInTheDocument();

        // Should NOT show February
        expect(
            screen.queryByText((text) => text.includes("February 2025"))
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText((text) => text.includes("200.00"))
        ).not.toBeInTheDocument();
    });
});
