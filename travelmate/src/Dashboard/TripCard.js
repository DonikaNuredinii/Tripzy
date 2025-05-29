import React from "react";

const TripCard = ({ trip }) => {
  return (
    <div className="trip-card">
      <h4>{trip.title}</h4>
      <p>{trip.Description}</p>
      <p>
        <strong>Country:</strong> {trip.country?.Name}
      </p>
      <p>
        <strong>City:</strong> {trip.Destination_city}
      </p>
      <p>
        <strong>Style:</strong> {trip.Travel_STYLE}
      </p>
      <p>
        <strong>Budget:</strong> €{trip.Budget_estimated}
      </p>
    </div>
  );
};

export default TripCard;
