import React, { useState } from "react";
import NavbarFeed from "../Components/NavBar-feed";
import TripFeedContent from "./TripFeed";
import MatchRequests from "../Components/MatchRequests ";

const TripFeedC = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <NavbarFeed onBellClick={() => setShowSidebar((prev) => !prev)} />
      <div className="feed-page-container">
        <div className="main-feed-content">
          <TripFeedContent />
        </div>
        {showSidebar && (
          <div className="sidebar-match">
            <MatchRequests />
          </div>
        )}
      </div>
    </>
  );
};

export default TripFeedC;
