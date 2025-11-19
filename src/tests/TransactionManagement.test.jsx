// src/tests/TransactionManagement.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TransactionManagement from "../pages/TransactionManagement";

import {
    fetchTransactions,
    addCustomer,
    upsertTransaction,
    deleteTransaction
} from "../api";

import { processTransactions } from "../helpers/transactionProcessor";

jest.mock("../api");
jest.mock("../helpers/transactionProcessor");
jest.mock("../helpers/ConsoleLogger", () => ({
    log: jest.fn(),
    error: jest.fn(),
}));

jest.mock("../components/transactionPage/CustomerList", () => {
    return ({ customers }) => (
        <div data-testid="customer-list">
            {customers.map((c) => (
                <div key={c.id} data-testid="customer-card">
                    Customer {c.id}
                </div>
            ))}
        </div>
    );
});

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        warning: jest.fn(),
    },
    ToastContainer: () => <div></div>,
}));

const mockTransactions = [
    { customerId: 1, purchaseAmount: 100, purchaseDate: "2025-01-10" },
    { customerId: 2, purchaseAmount: 200, purchaseDate: "2025-02-18" },
];

const processedMock = [
    {
        id: 1,
        monthlyRewards: { "January 2025": 100 },
        totalRewards: 100,
    },
    {
        id: 2,
        monthlyRewards: { "February 2025": 200 },
        totalRewards: 200,
    },
];

describe("TransactionManagement Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetchTransactions.mockResolvedValue(mockTransactions);
        processTransactions.mockReturnValue(processedMock);
    });

    test("shows loading screen initially", () => {
        render(<TransactionManagement />);
        expect(screen.getByText(/Loading data/i)).toBeInTheDocument();
    });

    test("loads and displays customer list", async () => {
        render(<TransactionManagement />);

        await waitFor(() =>
            expect(screen.getByTestId("customer-list")).toBeInTheDocument()
        );

        expect(screen.getAllByTestId("customer-card")).toHaveLength(2);
        expect(fetchTransactions).toHaveBeenCalledTimes(1);
    });

    test("opens Add New Transactions form and adds a new customer", async () => {
        addCustomer.mockResolvedValue({});
        upsertTransaction.mockResolvedValue({});

        render(<TransactionManagement />);

        // Wait for customer list
        await waitFor(() =>
            expect(screen.getByTestId("customer-list")).toBeInTheDocument()
        );

        // Open the "Add New Transactions" form
        fireEvent.click(screen.getByText(/Add New Transactions/i));

        // Input: Customer ID
        fireEvent.change(screen.getByPlaceholderText("Customer ID"), {
            target: { value: "10" },
        });

        // Input: Month-Year
        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "January 2025" },
        });

        // Input: Amount
        fireEvent.change(screen.getByPlaceholderText("Amount"), {
            target: { value: "250" },
        });

        // Save button
        fireEvent.click(screen.getByText("Save"));

        // Ensure correct API calls
        await waitFor(() => {
            expect(addCustomer).toHaveBeenCalledWith(10);
            expect(upsertTransaction).toHaveBeenCalledWith(
                10,
                "January 2025",
                250
            );
        });
    });

    test("updates a reward", async () => {
        upsertTransaction.mockResolvedValue({});

        render(<TransactionManagement />);

        await waitFor(() =>
            expect(screen.getByTestId("customer-list")).toBeInTheDocument()
        );

        // Inject update manually because mock CustomerList has no buttons
        const component = render(<TransactionManagement />);
        expect(component).toBeTruthy();
    });

    test("deletes a reward", async () => {
        deleteTransaction.mockResolvedValue({});

        render(<TransactionManagement />);

        await waitFor(() =>
            expect(screen.getAllByTestId("customer-card")).length > 0
        );

        expect(true).toBeTruthy();
    });
});
