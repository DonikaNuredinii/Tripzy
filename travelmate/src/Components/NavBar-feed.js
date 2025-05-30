import React from "react";
import { FiCompass, FiBell, FiUser, FiLogOut } from "react-icons/fi";
import { MdOutlineModeOfTravel } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "../CSS/Style.css";

const NavbarFeed = ({ onBellClick }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const isAdmin = Number(user.Roleid) === 1;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar-feed">
      <div className="navbar-left">
        <NavLink to="/" className="logo-link">
          <MdOutlineModeOfTravel />
          <h1>TRIPZY</h1>
        </NavLink>
      </div>

      <div className="navbar-center">
        <NavLink to="/feed" className="nav-link">
          Feed
        </NavLink>
        <NavLink to="/messages" className="nav-link">
          Messages
        </NavLink>
        {isAdmin && (
          <NavLink to="/dashboard" className="nav-link">
            Dashboard
          </NavLink>
        )}
      </div>

      <div className="navbar-right">
        <FiBell
          className="nav-icon"
          title="Match Requests"
          onClick={onBellClick}
        />
        <NavLink to="/profile">
          <FiUser className="nav-icon" />
        </NavLink>
        <FiLogOut
          className="nav-icon log"
          title="Logout"
          onClick={handleLogout}
          style={{ cursor: "pointer", marginLeft: "auto" }}
        />
      </div>
    </nav>
  );
};

export default NavbarFeed;
