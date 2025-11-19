/**
 * Processes raw transaction data into customer objects with monthly and total rewards.
 * Filters transactions to the last 12 months and groups by customer and month.
 * @param {Array} transactions - Array of transaction objects from the database.
 * @returns {Array} Array of processed customer objects.
 */
export const processTransactions = (transactions) => {
    const customerData = {};
    const today = new Date();
    const cutoffDate = new Date();
    cutoffDate.setMonth(today.getMonth() - 12);

    // Filter to recent transactions (last 12 months)
    const recentTransactions = transactions.filter((t) => {
        const txnDate = new Date(t.purchaseDate);
        return txnDate >= cutoffDate && txnDate <= today;
    });

    recentTransactions.forEach((transaction) => {
        const { customerId, purchaseAmount, purchaseDate } = transaction;
        const date = new Date(purchaseDate);
        const month = date.toLocaleString("en-US", { month: "long" });
        const year = date.getFullYear();
        const monthYear = `${month} ${year}`;

        const points = Number(purchaseAmount) || 0;

        if (!customerData[customerId]) {
            customerData[customerId] = {
                id: customerId,
                monthlyRewards: {},
                totalRewards: 0,
            };
        }

        if (!customerData[customerId].monthlyRewards[monthYear]) {
            customerData[customerId].monthlyRewards[monthYear] = 0;
        }

        customerData[customerId].monthlyRewards[monthYear] += points;
        customerData[customerId].totalRewards += points;
    });

    return Object.values(customerData).map((customer) => ({
        ...customer,
        monthlyRewards: Object.fromEntries(
            Object.entries(customer.monthlyRewards).map(([month, val]) => [
                month,
                val.toFixed(2),
            ])
        ),
        totalRewards: customer.totalRewards.toFixed(2),
    }));
};
