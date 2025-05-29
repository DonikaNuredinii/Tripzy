import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Style.css"; // Adjust this to your file structure

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  


  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
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

  const formData = new FormData();

  Object.entries(user).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  if (newPassword.trim() !== "") {
    formData.append("Password", newPassword);
  }

  // ✅ Only append if a new photo was selected
  if (profilePhoto) {
    formData.append("Profile_photo", profilePhoto);
  }

  // ✅ Handle boolean explicitly (Laravel doesn't like strings for booleans)
  formData.append("Verified", user.Verified ? 1 : 0);

  console.log("Uploading:", profilePhoto);

  try {
    await axios.post(
      `http://localhost:8000/api/users/${user.Userid}?_method=PUT`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setMessage("Profile updated successfully.");
    setNewPassword("");
    setConfirmPassword("");
    setProfilePhoto(null);
    fetchUser();
  } catch (err) {
    if (err.response?.status === 422) {
      const errors = err.response.data.errors;
      const allMessages = Object.values(errors).flat().join(" ");
      setMessage(allMessages);
    } else {
      console.error("Update failed", err);
      setMessage("Failed to update profile.");
    }
  }
};



  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      console.log("Preview:", URL.createObjectURL(file));
      setProfilePhoto(file);
    }
  };




  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
   window.location.href = "/feed";

  };

  


  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">


        <div className="profile-page">
          <div className="top-bar">
        <button className="back-button1" onClick={() => window.location.href = "/feed"}>
          ← Back to Home
        </button>
      </div>
          <aside className="sidebar-profile">

            <div className="user-info">
              <div className="profile-image-container">
      <img
        src={
          user.Profile_photo
            ? `http://localhost:8000/storage/${user.Profile_photo}`
            : "/default-profile.png"
        }
        alt="Profile"
        className="profile-avatar"
      />
      <label htmlFor="profile-upload" className="upload-btn">
      Change Photo
      </label>
      <input
        type="file"
        id="profile-upload"
        accept="image/*"
        onChange={handlePhotoChange}
        style={{ display: "none" }}
      />

    </div>


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

