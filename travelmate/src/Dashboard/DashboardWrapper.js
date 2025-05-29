import React from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardWrapper = () => {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#f5f5f4",
        minHeight: "100vh",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardWrapper;
