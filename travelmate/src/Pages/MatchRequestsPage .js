import React from "react";
import MatchRequests from "../Components/MatchRequests ";

const MatchRequestsPage = () => {
  return (
    <div className="match-requests-page">
      <h2>Pending Match Requests</h2>
      <MatchRequests />
    </div>
  );
};

export default MatchRequestsPage;
