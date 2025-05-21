import React from "react";
import { FiCompass, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { MdOutlineModeOfTravel } from "react-icons/md";

import "../CSS/Style.css";

const NavbarFeed = () => {
  return (
    <nav className="navbar-feed">
      <div className="navbar-left">
        <MdOutlineModeOfTravel />
        <h1>TRIPZY</h1>
      </div>
      <div className="navbar-center">
        <a href="/feed" className="nav-link active">
          Feed
        </a>
        <a href="/explore" className="nav-link">
          Explore
        </a>
        <a href="/matches" className="nav-link">
          Matches
        </a>
        <a href="/messages" className="nav-link">
          Messages
        </a>
      </div>
      <div className="navbar-right">
        <FiCompass className="nav-icon" />
        <FiBell className="nav-icon" />
        <FiUser className="nav-icon" />
        <FiLogOut className="nav-icon" title="Logout" />
      </div>
    </nav>
  );
};

export default NavbarFeed;
