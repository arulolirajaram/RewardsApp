import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddForm from "../components/transactionPage/AddForm";

describe("AddRewardForm", () => {
    test("calls onAdd with correct data", () => {
        const onAdd = jest.fn();
        const onCancel = jest.fn();

        render(<AddForm onAdd={onAdd} onCancel={onCancel} />);

        // Select Month
        const monthSelect = screen.getAllByRole("combobox")[0];
        fireEvent.change(monthSelect, { target: { value: "January" } });

        // Select Year
        const yearSelect = screen.getAllByRole("combobox")[1];
        fireEvent.change(yearSelect, { target: { value: "2025" } });

        // Enter amount
        fireEvent.change(screen.getByPlaceholderText("Amount"), {
            target: { value: "300" }
        });

        // Submit
        fireEvent.click(screen.getByText("Add"));

        // Expect combined "January 2025"
        expect(onAdd).toHaveBeenCalledWith("January 2025", 300);
    });

    test("calls onCancel when Cancel button is clicked", () => {
        const onAdd = jest.fn();
        const onCancel = jest.fn();

        render(<AddForm onAdd={onAdd} onCancel={onCancel} />);

        fireEvent.click(screen.getByText("Cancel"));
        expect(onCancel).toHaveBeenCalled();
    });
});
