import React from "react";

const FilterBar = ({ filters, setFilters, countries }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      country: "",
      style: "",
      maxBudget: "",
    });
  };

  return (
    <div className="filter-bar">
      <select name="country" value={filters.country} onChange={handleChange}>
        <option value="">All Countries</option>
        {countries.map((c) => (
          <option key={c.Countryid} value={c.Name}>
            {c.Name}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="style"
        placeholder="Travel Style"
        value={filters.style}
        onChange={handleChange}
      />

      <input
        type="number"
        name="maxBudget"
        placeholder="Max Budget (€)"
        value={filters.maxBudget}
        onChange={handleChange}
      />

      <button onClick={handleReset} className="reset-btn">
        🔄 Reset Filters
      </button>
    </div>
  );
};

export default FilterBar;
