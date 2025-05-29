import React from "react";
import { NavLink } from "react-router-dom";
import "../CSS/Dashboard.css";
import { FaUser, FaSuitcase, FaGlobe, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/feed" className="sidebar-title">
        <h2>Tripzy</h2>
      </NavLink>
      <nav className="sidebar-nav">
        {" "}
        <NavLink
          to="/dashboard/statistics"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaChartBar className="icon" /> Statistics
        </NavLink>
        <NavLink
          to="/dashboard/users"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaUser className="icon" /> Users
        </NavLink>
        <NavLink
          to="/dashboard/trips"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaSuitcase className="icon" /> Trips Explorer
        </NavLink>
        <NavLink
          to="/dashboard/country"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaGlobe className="icon" /> Country Form
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
