import ConsoleLog from "./helpers/ConsoleLogger";

const API_BASE = "http://localhost:3002/api";

// Get all transactions
export const fetchTransactions = async () => {
    const res = await fetch(`${API_BASE}/transactions`);
    ConsoleLog.log(res);
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json();
};

// Get all customers
export const fetchCustomers = async () => {
    const res = await fetch(`${API_BASE}/customers`);
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
};

export const fetchRewards = async () => {
    const res = await fetch(`${API_BASE}/rewards`);
    if (!res.ok) throw new Error("Failed to fetch rewards");
    return res.json();
}

// Add / Update a Transaction (Upsert)
export const upsertTransaction = async (customerId, monthYear, purchaseAmount) => {
    const res = await fetch(`${API_BASE}/transactions/upsert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, monthYear, purchaseAmount }),
    });
    if (!res.ok) throw new Error("Failed to upsert transaction");
    return res.json();
};

// Delete a Transaction
export const deleteTransaction = async (customerId, monthYear) => {
    const res = await fetch(`${API_BASE}/transactions/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, monthYear }),
    });
    if (!res.ok) throw new Error("Failed to delete transaction");
    return res.json();
};

// Add new customer
export const addCustomer = async (customerId) => {
    const res = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
    });
    if (!res.ok) throw new Error("Failed to add customer");
    return res.json();
};
