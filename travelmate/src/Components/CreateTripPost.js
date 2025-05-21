import React, { useState, useEffect } from "react";
import "../CSS/Style.css";
import { FiX, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CreateTripPost = () => {
  const [trip, setTrip] = useState({
    description: "",
    destinationCountry: "",
    destinationCity: "",
    departureDate: "",
    returnDate: "",
    travelStyle: "",
    budget: "",
    lookingFor: "",
    photos: [],
  });

  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setTrip((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setTrip((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;

      if (e.key === "Escape") {
        setSelectedImage(null);
      }

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const currentIndex = trip.photos.findIndex((f) => f === selectedImage);
        if (currentIndex === -1) return;

        const nextIndex =
          e.key === "ArrowRight"
            ? (currentIndex + 1) % trip.photos.length
            : (currentIndex - 1 + trip.photos.length) % trip.photos.length;

        setSelectedImage(trip.photos[nextIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, trip.photos]);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("Please log in first.");
      return;
    }

    const formData = new FormData();
    formData.append("Userid", user.Userid);
    formData.append("title", "My Trip"); 
    formData.append("Description", trip.description);
    formData.append("Destination_country", trip.destinationCountry);
    formData.append("Destination_city", trip.destinationCity);
    formData.append("Departuredate", trip.departureDate);
    formData.append("Return_date", trip.returnDate);
    formData.append("Travel_STYLE", trip.travelStyle);
    formData.append("Budget_estimated", trip.budget);
    formData.append("Looking_for", trip.lookingFor);

    trip.photos.forEach((photo) => {
      formData.append("photos[]", photo);
    });

    try {
      const res = await fetch("http://localhost:8000/api/trips", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Trip created successfully!");
        setTrip({
          description: "",
          destinationCountry: "",
          destinationCity: "",
          departureDate: "",
          returnDate: "",
          travelStyle: "",
          budget: "",
          lookingFor: "",
          photos: [],
        });
      } else {
        console.error("Error:", data);
        alert("Error posting trip.");
      }
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="trip-post">
      {/* Header Section */}
      <div className="header">
        <img src="/profile-placeholder.jpg" alt="Profile" className="avatar" />
        <div className="description-input">
          <textarea
            placeholder="What's on your mind?"
            name="description"
            value={trip.description}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="photo-upload-frame">
        <div
          className={`drop-area ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="icon-box">
            <span className="plus-icon">📷</span>
            <p>
              Add photos/videos
              <br />
              <small>or drag and drop</small>
            </p>
          </div>
          <input
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <div className="mobile-upload">
          <span className="device-icon">📱</span>
          <span className="upload-text">
            Add photos and videos from your mobile device.
          </span>
          <button
            type="button"
            className="add-btn"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Add
          </button>
        </div>

        {trip.photos.length > 0 && (
          <div className="preview-container">
            {trip.photos.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt="preview"
                className="preview-image"
                onClick={() => setSelectedImage(file)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Trip Details */}
      <div className="trip-options">
        <TripOption
          icon="🌍"
          name="destinationCountry"
          value={trip.destinationCountry}
          onChange={handleChange}
          placeholder="Destination Country"
        />
        <TripOption
          icon="🏙️"
          name="destinationCity"
          value={trip.destinationCity}
          onChange={handleChange}
          placeholder="Destination City"
        />
        <TripOption
          icon="📅"
          name="departureDate"
          value={trip.departureDate}
          onChange={handleChange}
          placeholder="Departure Date"
          type="date"
        />
        <TripOption
          icon="📆"
          name="returnDate"
          value={trip.returnDate}
          onChange={handleChange}
          placeholder="Return Date"
          type="date"
        />
        <TripOption
          icon="🧭"
          name="travelStyle"
          value={trip.travelStyle}
          onChange={handleChange}
          placeholder="Travel Style"
        />
        <TripOption
          icon="💸"
          name="budget"
          value={trip.budget}
          onChange={handleChange}
          placeholder="Estimated Budget"
          type="number"
          suffix="€"
        />
        <TripOption
          icon="🧍‍♀️"
          name="lookingFor"
          value={trip.lookingFor}
          onChange={handleChange}
          placeholder="Looking For"
        />
      </div>

      <button className="post-button" onClick={handleSubmit}>
        Post
      </button>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div style={{ position: "relative" }}>
            <button
              className="nav-button left"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = trip.photos.findIndex(
                  (f) => f === selectedImage
                );
                const prevIndex =
                  (currentIndex - 1 + trip.photos.length) % trip.photos.length;
                setSelectedImage(trip.photos[prevIndex]);
              }}
            >
              <FiChevronLeft size={28} />
            </button>

            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Full Preview"
              className="modal-image"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              className="nav-button right"
              onClick={(e) => {
                e.stopPropagation();
                const currentIndex = trip.photos.findIndex(
                  (f) => f === selectedImage
                );
                const nextIndex = (currentIndex + 1) % trip.photos.length;
                setSelectedImage(trip.photos[nextIndex]);
              }}
            >
              <FiChevronRight size={28} />
            </button>

            <button
              className="close-modal"
              onClick={() => setSelectedImage(null)}
              title="Close"
            >
              <FiX size={20} />
            </button>

            <button
              className="delete-modal"
              onClick={(e) => {
                e.stopPropagation();
                setTrip((prev) => ({
                  ...prev,
                  photos: prev.photos.filter((f) => f !== selectedImage),
                }));
                setSelectedImage(null);
              }}
              title="Delete"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TripOption = ({
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  suffix,
}) => (
  <div className="trip-option">
    <span className="icon">{icon}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {suffix && <span className="input-suffix">{suffix}</span>}
  </div>
);

export default CreateTripPost;
