import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaUsers, FaGlobe, FaComments, FaHandshake } from "react-icons/fa";
import "../CSS/Style.css";

const Statistics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/statistics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch statistics", err);
      }
    };

    fetchStats();
  }, []);

  const pastelColors = [
    "#A8DADC", "#FFE066", "#BFD8B8", "#FFD6E0", "#C4B0FF",
    "#AED9E0", "#F8C8DC", "#FBE8A6", "#D6EADF", "#EADFF6"
  ];

  if (!stats) return <p>Loading statistics...</p>;

  const cards = [
    {
      icon: <FaUsers size={24} />,
      title: "Total Users",
      value: stats.totalUsers,
      growth: 0.0,
    },
    {
      icon: <FaGlobe size={24} />,
      title: "Total Trips",
      value: stats.totalTrips,
      growth: 3.2,
    },
    {
      icon: <FaHandshake size={24} />,
      title: "Match Requests",
      value: stats.totalMatches,
      growth: 1.1,
    },
    {
      icon: <FaComments size={24} />,
      title: "Comments",
      value: stats.totalComments,
      growth: 2.4,
    },
  ];

  return (
    <div className="dashboard-stats">
      <h2>📊 Dashboard Statistics</h2>

      <div className="stats-grid">
        {cards.map((card, index) => (
          <div className="stat-box" key={index}>
            <div className="stat-icon">{card.icon}</div>
            <h4 className="stat-title">{card.title}</h4>
            <p className="stat-value">{card.value}</p>
            <p className="stat-growth">
              Growth Percentage: <span>{card.growth}%</span>
            </p>
            <div className="stat-progress">
              <div
                className="progress-bar"
                style={{ width: `${card.growth}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="statistics-grid">
        <div className="top-countries">
          <h3>🌍 Top 5 Destination Countries</h3>
          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={stats.topCountries}
                dataKey="count"
                nameKey="Destination_country"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={2}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(1)}%)`
                }
              >
                {stats.topCountries.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pastelColors[index % pastelColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} trips`, "Country"]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="most-liked-posts">
          <h3 className="table-title">🔥 Most Liked Trips</h3>
          <div className="table-wrapper">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Trip Title</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {stats.mostLikedPosts.map((trip, index) => (
                  <tr key={trip.Tripid}>
                    <td>{index + 1}</td>
                    <td>{trip.Title}</td>
                    <td>
                      <span className="likes-badge">{trip.Likes} ❤️</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
