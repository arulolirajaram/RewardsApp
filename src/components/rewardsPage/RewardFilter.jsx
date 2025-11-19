import React from "react";
import { DATA_YEARS } from '../../data/years';
import { DATA_MONTHS } from '../../data/months';

const RewardsFilter = ({
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    showOnlyWithRewards,
    setShowOnlyWithRewards,
}) => {
    return (
        <div className="filters">
            <label>
                Month:
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                >
                    <option value="All">All</option>
                    {DATA_MONTHS.map((filterMonth) => (
                        <option key={filterMonth} value={filterMonth}>
                            {filterMonth}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Year:
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="All">All</option>
                    {DATA_YEARS.map((filterYear) => (
                        <option key={filterYear} value={filterYear}>
                            {filterYear}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={showOnlyWithRewards}
                    onChange={(e) => setShowOnlyWithRewards(e.target.checked)}
                />
                Show only customers with rewards
            </label>
        </div>
    );
};

export default RewardsFilter;