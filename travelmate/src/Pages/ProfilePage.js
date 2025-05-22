import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Style.css"; // Adjust this to your file structure

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const handleChange = (e) => {
  setUser({ ...user, [e.target.name]: e.target.value });
};



  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

 const handleSave = async () => {
  if (newPassword !== confirmPassword) {
    setMessage("Passwords do not match.");
    return;
  }

  const updatedData = {
    ...user,
  };

  if (newPassword.trim() !== "") {
    updatedData.Password = newPassword;
  }

  try {
    await axios.put(`http://localhost:8000/api/users/${user.Userid}`, updatedData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setMessage("Profile updated successfully.");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    console.error("Update failed", err);
    setMessage("Failed to update profile.");
  }
};



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // redirect to login or homepage
  };


  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
<div className="profile-container">
   
    
    <div className="profile-page">
      <div className="top-bar">
    <button className="back-button1" onClick={() => window.location.href = "/"}>
      ← Back to Home
    </button>
  </div>
      <aside className="sidebar">
        
        <div className="user-info">
          {/* <img
            src="/default-profile.png" // Replace with dynamic photo if available
            alt="Profile"
            className="profile-pic"
          /> */}
          <h3>{user.Name} {user.Lastname}</h3>
        </div>
        <ul className="sidebar-menu">
          <li className="active">Account</li>
          <li>Publishing</li>
          <li>Notifications</li>
          <li>Membership and Payment</li>
          <li>Security and Apps</li>
        </ul>
        <button className="logout-button" onClick={handleLogout}>Log Out</button>
      </aside>

      <main className="profile-settings">
          <h2>Account Settings</h2>

        <div className="form-row">
          <div className="form-group first-name">
            <label>First Name</label>
            <input
              type="text"
              name="Name"
              value={user.Name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group last-name">
            <label>Last Name</label>
            <input
              type="text"
              name="Lastname"
              value={user.Lastname}
              onChange={handleChange}
            />
          </div>
        </div>


           <div className="form-group">
            <label>Email (read-only)</label>
            <input
              type="email"
              name="Email"
              value={user.Email}
              readOnly
              disabled
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="Bio"
              value={user.Bio || ""}
              maxLength={160}
              onChange={handleChange}
            />
          </div>

          {/* <div className="form-group">
            <label>Birthdate</label>
            <input
              type="date"
              name="Birthdate"
              value={user.Birthdate || ""}
              onChange={handleChange}
            />
          </div> */}

          
          <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
          
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
          
          
          
          
          
         <button type="submit" className="save-button" onClick={handleSave}>
            Save Changes
          </button>

          
          {message && <p className="message">{message}</p>}
        </main>

    </div>

    </div>
  );
};

export default ProfilePage;

