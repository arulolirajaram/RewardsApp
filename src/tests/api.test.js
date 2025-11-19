import {
    fetchTransactions,
    fetchCustomers,
    fetchRewards,
    upsertTransaction,
    deleteTransaction,
    addCustomer
} from "../api";


global.fetch = jest.fn();

describe("API helper tests", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test("fetchTransactions returns data on success", async () => {
        const mockData = [{ id: 1, amount: 120 }];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData)
        });

        const data = await fetchTransactions();
        expect(data).toEqual(mockData);
        expect(fetch).toHaveBeenCalledWith("http://localhost:3002/api/transactions");
    });

    test("fetchTransactions throws error on failure", async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(fetchTransactions()).rejects.toThrow("Failed to fetch transactions");
    });

    test("fetchCustomers returns data", async () => {
        const mockData = [{ customerId: 1 }];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const data = await fetchCustomers();
        expect(data).toEqual(mockData);
        expect(fetch).toHaveBeenCalledWith("http://localhost:3002/api/customers");
    });

    test("fetchCustomers throws error on failure", async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(fetchCustomers()).rejects.toThrow("Failed to fetch customers");
    });

    test("fetchRewards returns data", async () => {
        const mockData = [{ points: 50 }];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const data = await fetchRewards();
        expect(data).toEqual(mockData);
        expect(fetch).toHaveBeenCalledWith("http://localhost:3002/api/rewards");
    });

    test("fetchRewards throws error on failure", async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(fetchRewards()).rejects.toThrow("Failed to fetch rewards");
    });

    test("upsertTransaction sends POST and returns data", async () => {
        const mockData = { success: true };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const data = await upsertTransaction(1, "2025-01", 120);

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:3002/api/transactions/upsert",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: 1,
                    monthYear: "2025-01",
                    purchaseAmount: 120,
                }),
            }
        );

        expect(data).toEqual(mockData);
    });

    test("upsertTransaction throws error on failure", async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(upsertTransaction(1, "2025-01", 120)).rejects.toThrow(
            "Failed to upsert transaction"
        );
    });

    test("deleteTransaction sends DELETE and returns data", async () => {
        const mockData = { deleted: true };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const data = await deleteTransaction(1, "2025-01");

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:3002/api/transactions/delete",
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: 1,
                    monthYear: "2025-01",
                }),
            }
        );

        expect(data).toEqual(mockData);
    });

    test("deleteTransaction throws error on failure", async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(deleteTransaction(1, "2025-01")).rejects.toThrow(
            "Failed to delete transaction"
        );
    });

    test("addCustomer sends POST and returns data", async () => {
        const mockData = { added: true };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const data = await addCustomer(1001);

        expect(fetch).toHaveBeenCalledWith(
            "http://localhost:3002/api/customers",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ customerId: 1001 }),
            }
        );

        expect(data).toEqual(mockData);
    });

    test("addCustomer throws error on failure", async () => {
        fetch.mockResolvedValueOnce({ ok: false });
        await expect(addCustomer(1001)).rejects.toThrow(
            "Failed to add customer"
        );
    });
});
