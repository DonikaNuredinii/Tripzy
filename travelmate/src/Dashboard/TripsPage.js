import React, { useState, useEffect } from "react";
import axios from "axios";
import FilterBar from "./FilterBar";
import TripCard from "./TripCard";
import "../CSS/Style.css";

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({
    country: "",
    style: "",
    maxBudget: "",
  });
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchTrips();
    fetchCountries();
  }, []);

  const fetchTrips = async () => {
    const token = localStorage.getItem("auth_token");
    const res = await axios.get("http://localhost:8000/api/trips", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTrips(res.data);
  };

  const fetchCountries = async () => {
    const res = await axios.get("http://localhost:8000/api/countries");
    setCountries(res.data);
  };

  const filteredTrips = trips.filter((trip) => {
    return (
      (!filters.country || trip.country?.Name === filters.country) &&
      (!filters.style ||
        trip.Travel_STYLE.toLowerCase().includes(
          filters.style.toLowerCase()
        )) &&
      (!filters.maxBudget ||
        trip.Budget_estimated <= parseFloat(filters.maxBudget))
    );
  });

  return (
    <div className="dashboard-container">
      <h2>🧭 Trips with Filter</h2>
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        countries={countries}
      />
      {filteredTrips.length > 0 ? (
        filteredTrips.map((trip) => <TripCard key={trip.Tripid} trip={trip} />)
      ) : (
        <p>No trips match the selected criteria.</p>
      )}
    </div>
  );
};

export default TripsPage;
