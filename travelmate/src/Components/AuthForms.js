import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/Style.css";
import { useAuth } from "../contexts/AuthContext";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/login",
        loginData
      );
      login(res.data.user, res.data.token);
      setMessage("Login successful");
      navigate("/feed");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupData.Password !== signupData.ConfirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/register", {
        Name: signupData.Name,
        Lastname: signupData.Lastname,
        Email: signupData.Email,
        Password: signupData.Password,
        Password_confirmation: signupData.ConfirmPassword,
        Gender: signupData.Gender,
        Birthdate: signupData.Birthdate,
      });

      const loginRes = await axios.post("http://localhost:8000/api/login", {
        Email: signupData.Email,
        Password: signupData.Password,
      });

      login(loginRes.data.user, loginRes.data.token);
      setMessage("Signup successful");
      navigate("/feed");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <section className="auth-section">
      <div className={`form-container ${isLogin ? "" : "signup-mode"}`}>
        {/* LOGIN FORM */}
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
            <button className="authbutton" type="submit">
              Log In
            </button>
          </form>
          <p>
            Don't have an account?{" "}
            <span onClick={() => setIsLogin(false)}>Sign up</span>
          </p>
        </div>

        {/* SIGNUP FORM */}
        <div className="form-box signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignupSubmit}>
            <input
              type="text"
              name="Name"
              placeholder="First Name"
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
            <button className="authbutton" type="submit">
              Sign Up
            </button>
          </form>
          <p>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Log in</span>
          </p>
        </div>
      </div>

      {message && <p className="message">{message}</p>}
    </section>
  );
};

export default AuthForms;
