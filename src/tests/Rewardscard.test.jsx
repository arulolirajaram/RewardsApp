import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Rewardscard from "../components/rewardsPage/Rewardscard";

describe("Rewardscard Component", () => {
    const mockUpdate = jest.fn();

    const customer = {
        id: 1,
        monthlyRewards: {
            "January 2025": 50,
            "February 2025": 70
        },
        totalRewards: 120,
    };

    beforeEach(() => mockUpdate.mockClear());

    test("add new reward", () => {
        render(<Rewardscard customer={customer} onUpdate={mockUpdate} />);

        // OPEN ADD FORM
        fireEvent.click(screen.getByText("Add New Reward"));

        // SELECT MONTH
        const monthSelect = screen.getByRole("combobox");
        fireEvent.change(monthSelect, {
            target: { value: "March" }
        });

        // SELECT YEAR
        const yearInput = screen.getByPlaceholderText("Year (e.g., 2025)");
        fireEvent.change(yearInput, {
            target: { value: "2025" }
        });

        // ENTER POINTS
        fireEvent.change(screen.getByPlaceholderText("Points"), {
            target: { value: "80" }
        });

        // SUBMIT
        fireEvent.click(screen.getByText("Add"));

        expect(mockUpdate).toHaveBeenCalledWith(1, "March 2025", 80);
    });
});
