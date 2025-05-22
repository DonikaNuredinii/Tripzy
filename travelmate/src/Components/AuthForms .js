import React, { useState } from "react";
import axios from "axios";
import "../CSS/Style.css";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const [loginData, setLoginData] = useState({ Email: "", Password: "" });
  const [signupData, setSignupData] = useState({
    Name: "",
    Lastname: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Gender: "",
    Birthdate: "",
  });
  const [message, setMessage] = useState("");

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8000/api/login", loginData);
    setMessage("Login successful");
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setIsAuthenticated(true); // ✅ update login status
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    setMessage(err.response?.data?.message || "Login failed");
  }
};


  const handleLogout = () => {
  localStorage.removeItem("token");
  setIsAuthenticated(false);
  setMessage("Logged out successfully");
};




  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.Password !== signupData.ConfirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/register", {
        Name: signupData.Name,
        Lastname: signupData.Lastname,
        Email: signupData.Email,
        Password: signupData.Password,
        Password_confirmation: signupData.ConfirmPassword,
        Gender: signupData.Gender,
        Birthdate: signupData.Birthdate,
      });
      setMessage("Signup successful");
      setIsLogin(true); // Switch to login mode
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <section className="auth-section">
      <div className={`form-container ${isLogin ? "" : "signup-mode"}`}>
        <div className="form-box login-form">
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              name="Email"
              placeholder="Email"
              onChange={handleLoginChange}
              required
            />
            <input
              type="password"
              name="Password"
              placeholder="Password"
              onChange={handleLoginChange}
              required
            />
            <button type="submit">Log In</button>
          </form>
          <p>
            Don't have an account?{" "}
            <span onClick={() => setIsLogin(false)}>Sign up</span>
          </p>
        </div>

        <div className="form-box signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignupSubmit}>
            <input
              type="text"
              name="Name"
              placeholder="Full Name"
              onChange={handleSignupChange}
              required
            />
            <input
              type="text"
              name="Lastname"
              placeholder="Last Name"
              onChange={handleSignupChange}
              required
            />
            <input
              type="email"
              name="Email"
              placeholder="Email Address"
              onChange={handleSignupChange}
              required
            />
            <input
              type="password"
              name="Password"
              placeholder="Password"
              onChange={handleSignupChange}
              required
            />
            <input
              type="password"
              name="ConfirmPassword"
              placeholder="Confirm Password"
              onChange={handleSignupChange}
              required
            />
            <select name="Gender" onChange={handleSignupChange} required>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not">Prefer not to say</option>
            </select>
            <input
              type="date"
              name="Birthdate"
              onChange={handleSignupChange}
              required
            />
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Log in</span>
          </p>
        </div>
      </div>
      {message && <p className="message">{message}</p>}
      {isAuthenticated && (
  <div style={{ textAlign: "center", marginTop: "1rem" }}>
    <button onClick={handleLogout} style={{ padding: "10px 20px" }}>
      Log Out
    </button>
  </div>
)}

    </section>
  );
};

export default AuthForms;

