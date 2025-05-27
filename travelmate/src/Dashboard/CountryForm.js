import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/Dashboard.css";
import { FaTrash, FaEdit } from "react-icons/fa";

const CountryPage = () => {
  const [countries, setCountries] = useState([]);
  const [modalCountry, setModalCountry] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/countries");
      setCountries(res.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this county?")) {
      try {
        await axios.delete(`http://localhost:8000/api/countries/${id}`);
        fetchCountries();
      } catch (err) {
        console.error("Error while deleting:", err);
        alert("Deleting failed.");
      }
    }
  };

  const handleAdd = () => {
    setModalCountry({
      Name: "",
      Image_path: "",
    });
    setIsEditMode(false);
  };

  const handleEdit = (country) => {
    setModalCountry({ ...country });
    setIsEditMode(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:8000/api/countries/${modalCountry.Countryid}`,
          modalCountry
        );
      } else {
        await axios.post("http://localhost:8000/api/countries", modalCountry);
      }
      setModalCountry(null);
      fetchCountries();
    } catch (err) {
      console.error("Error while saving:", err);
      alert("Save failed.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalCountry({ ...modalCountry, [name]: value });
  };

  return (
    <div className="user-page">
      <button className="btn-dark" onClick={handleAdd}>
        + Add country{" "}
      </button>
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Country</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country, index) => (
            <tr key={country.Countryid}>
              <td>{index + 1}</td>
              <td>{country.Name}</td>
              <td>
                {country.Image_path ? (
                  <div className="country-img-wrapper">
                    <img
                      src={country.Image_path}
                      alt={country.Name}
                      className="country-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/Images/profile-placeholder.jpg";
                      }}
                    />
                  </div>
                ) : (
                  <span style={{ fontStyle: "italic", color: "#888" }}>
                    Without image
                  </span>
                )}
              </td>

              <td className="action-cell">
                <button
                  onClick={() => handleEdit(country)}
                  className="icon-btn"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(country.Countryid)}
                  className="icon-btn"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalCountry && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{isEditMode ? "Edit" : "Add country"}</h3>
            <form onSubmit={handleSubmit} className="user-form">
              {isEditMode && (
                <div className="form-group">
                  <label>ID</label>
                  <input type="text" value={modalCountry.Countryid} disabled />
                </div>
              )}
              <div className="form-group">
                <label>Country name</label>
                <input
                  name="Name"
                  value={modalCountry.Name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image url</label>
                <input
                  name="Image_path"
                  value={modalCountry.Image_path || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-light"
                  onClick={() => setModalCountry(null)}
                >
                  Close
                </button>
                <button type="submit" className="btn-dark">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryPage;
