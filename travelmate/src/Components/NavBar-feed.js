import React from "react";
import { FiCompass, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { MdOutlineModeOfTravel } from "react-icons/md";
import { NavLink } from "react-router-dom"; // ⬅️ Use NavLink
import "../CSS/Style.css";

const NavbarFeed = () => {
  return (
    <nav className="navbar-feed">
      <div className="navbar-left">
        <MdOutlineModeOfTravel />
        <h1>TRIPZY</h1>
      </div>

      <div className="navbar-center">
        <NavLink to="/feed" className="nav-link">
          Feed
        </NavLink>
        <NavLink to="/explore" className="nav-link">
          Explore
        </NavLink>
        <NavLink to="/matches" className="nav-link">
          Matches
        </NavLink>
        <NavLink to="/messages" className="nav-link">
          Messages
        </NavLink>
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
