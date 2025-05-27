import React, { useEffect, useState } from "react";
import axios from "axios";
import "../CSS/Dashboard.css";
import { FaTrash, FaEdit } from "react-icons/fa";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalUser, setModalUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] =
      `Bearer ${localStorage.getItem("auth_token")}`;
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/users");
    setUsers(res.data);
  };

  const fetchRoles = async () => {
    const res = await axios.get("http://localhost:8000/api/roles");
    setRoles(res.data);
  };

  const handleEdit = (user) => {
    setModalUser({ ...user, Password: "", Roleid: user.Roleid });
    setIsEditMode(true);
  };

  const handleDelete = async (id) => {
    const cleanId = parseInt(id);
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8000/api/users/${cleanId}`);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Error deleting user.");
      }
    }
  };

  const handleAdd = () => {
    setModalUser({
      Name: "",
      Lastname: "",
      Email: "",
      Password: "",
      Birthdate: "",
      Country: "",
      Profile_photo: "",
      Roleid: 2,
    });
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:8000/api/users/${modalUser.Userid}`,
          modalUser
        );
      } else {
        await axios.post("http://localhost:8000/api/users", modalUser);
      }
      setModalUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalUser({ ...modalUser, [name]: value });
  };

  return (
    <div className="user-page">
      <button className="btn-dark" onClick={handleAdd}>
        + Add User
      </button>
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Email</th>
            <th>Password</th>
            <th>Birthdate</th>
            <th>Country</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr key={u.Userid}>
              <td>{index + 1}</td>
              <td>{u.Name}</td>
              <td>{u.Lastname}</td>
              <td>{u.Email}</td>
              <td>*******</td>
              <td>{u.Birthdate}</td>
              <td>{u.Country}</td>
              <td>{u.role?.Name}</td>
              <td>
                <button onClick={() => handleEdit(u)} className="icon-btn">
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(parseInt(u.Userid))}
                  className="icon-btn"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{isEditMode ? "Edit User" : "Add New User"}</h3>
            <form onSubmit={handleSubmit} className="user-form">
              {isEditMode && (
                <div className="form-group">
                  <label>ID</label>
                  <input type="text" value={modalUser.Userid} disabled />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    name="Name"
                    value={modalUser.Name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    name="Lastname"
                    value={modalUser.Lastname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  name="Email"
                  type="email"
                  value={modalUser.Email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  name="Password"
                  type="password"
                  value={modalUser.Password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Birthdate</label>
                <input
                  name="Birthdate"
                  type="date"
                  value={modalUser.Birthdate || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <input
                  name="Country"
                  value={modalUser.Country || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="Roleid"
                  value={modalUser.Roleid}
                  onChange={handleChange}
                >
                  {roles.map((r) => (
                    <option key={r.Roleid} value={r.Roleid}>
                      {r.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-light"
                  onClick={() => setModalUser(null)}
                >
                  Close
                </button>
                <button type="submit" className="btn-dark">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
