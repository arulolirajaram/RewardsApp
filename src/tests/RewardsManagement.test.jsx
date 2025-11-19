import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RewardsManagement from "../pages/RewardsManagement";
import { fetchRewards } from "../api";

jest.mock("../api", () => ({
    fetchRewards: jest.fn(),
}));

const mockData = [
    { customerId: 1, rewardPoints: 100, createdAt: "2025-01-15T10:00:00Z" },
    { customerId: 1, rewardPoints: 200, createdAt: "2025-02-10T10:00:00Z" },
    { customerId: 2, rewardPoints: 300, createdAt: "2025-03-05T10:00:00Z" },
];

describe("RewardsManagement Page", () => {
    beforeEach(() => {
        fetchRewards.mockResolvedValue(mockData);
    });

    test("renders grouped customer rewards", async () => {
        render(<RewardsManagement />);

        await waitFor(() =>
            expect(
                screen.getByText((content) => content.includes("Customer ID: 1"))
            ).toBeInTheDocument()
        );

        expect(
            screen.getByText((content) => content.includes("Customer ID: 2"))
        ).toBeInTheDocument();

        expect(screen.getByText(/January 2025/i)).toBeInTheDocument();
        expect(screen.getByText(/February 2025/i)).toBeInTheDocument();
        expect(screen.getByText(/March 2025/i)).toBeInTheDocument();
    });

    test("shows no rewards inside customer card when filtered", async () => {
        render(<RewardsManagement />);

        await waitFor(() =>
            expect(
                screen.getByText((content) => content.includes("Customer ID: 1"))
            ).toBeInTheDocument()
        );

        // Apply filters that show no rewards
        fireEvent.change(screen.getByLabelText(/Month/i), {
            target: { value: "December" },
        });

        fireEvent.change(screen.getByLabelText(/Year/i), {
            target: { value: "2023" },
        });

        // Should show "No recent rewards found" inside cards
        expect(screen.getAllByText(/no recent rewards found/i).length).toBeGreaterThan(0);
    });

    test("toggle show only customers with rewards", async () => {
        render(<RewardsManagement />);

        await waitFor(() =>
            expect(
                screen.getByText((content) => content.includes("Customer ID: 1"))
            ).toBeInTheDocument()
        );

        const checkbox = screen.getByLabelText(/show only customers with rewards/i);

        fireEvent.click(checkbox);

        expect(
            screen.getByText((content) => content.includes("Customer ID: 1"))
        ).toBeInTheDocument();

        expect(
            screen.getByText((content) => content.includes("Customer ID: 2"))
        ).toBeInTheDocument();
    });
});
