
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RewardsFilter from "../components/rewardsPage/RewardFilter";

describe("RewardsFilter Component", () => {
    const mockSetMonth = jest.fn();
    const mockSetYear = jest.fn();
    const mockSetShow = jest.fn();

    test("renders all filter fields", () => {
        render(
            <RewardsFilter
                selectedMonth="All"
                setSelectedMonth={mockSetMonth}
                selectedYear="All"
                setSelectedYear={mockSetYear}
                showOnlyWithRewards={false}
                setShowOnlyWithRewards={mockSetShow}
            />
        );

        expect(screen.getByText(/Month/i)).toBeInTheDocument();
        expect(screen.getByText(/Year/i)).toBeInTheDocument();
        expect(screen.getByText(/Show only customers with rewards/i)).toBeInTheDocument();
    });

    test("changes month filter", () => {
        render(
            <RewardsFilter
                selectedMonth="All"
                setSelectedMonth={mockSetMonth}
                selectedYear="All"
                setSelectedYear={mockSetYear}
                showOnlyWithRewards={false}
                setShowOnlyWithRewards={mockSetShow}
            />
        );

        fireEvent.change(screen.getByLabelText(/Month/i), {
            target: { value: "January" },
        });

        expect(mockSetMonth).toHaveBeenCalledWith("January");
    });

    test("changes year filter", () => {
        render(
            <RewardsFilter
                selectedMonth="All"
                setSelectedMonth={mockSetMonth}
                selectedYear="All"
                setSelectedYear={mockSetYear}
                showOnlyWithRewards={false}
                setShowOnlyWithRewards={mockSetShow}
            />
        );

        fireEvent.change(screen.getByLabelText(/Year/i), {
            target: { value: "2025" },
        });

        expect(mockSetYear).toHaveBeenCalledWith("2025");
    });

    test("toggles show-only checkbox", () => {
        render(
            <RewardsFilter
                selectedMonth="All"
                setSelectedMonth={mockSetMonth}
                selectedYear="All"
                setSelectedYear={mockSetYear}
                showOnlyWithRewards={false}
                setShowOnlyWithRewards={mockSetShow}
            />
        );

        fireEvent.click(screen.getByRole("checkbox"));

        expect(mockSetShow).toHaveBeenCalledWith(true);
    });
});
