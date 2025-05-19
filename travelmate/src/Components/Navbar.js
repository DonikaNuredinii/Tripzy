import React from "react";
import { MdOutlineModeOfTravel } from "react-icons/md";
import "../CSS/Style.css";

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="logo-icon">
        <MdOutlineModeOfTravel />
        <h1>TRIPZY</h1>
      </div>
      <div className="login">
        <button
          className="login-btn"
          onClick={() =>
            document
              .getElementById("login-section")
              .scrollIntoView({ behavior: "smooth" })
          }
        >
          Log In
        </button>
      </div>
    </div>
  );
};
export default NavBar;
