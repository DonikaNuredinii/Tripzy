import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/Style.css";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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

  // ✅ Check token validity using /api/me
  const checkToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found");
      return false;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Token is valid. Logged-in user:", res.data);
      return res.data;
    } catch (err) {
      console.error("Token is invalid or expired");
      return false;
    }
  };

  // ✅ Run on component mount
  useEffect(() => {
    checkToken().then((user) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      }
    });
  }, []);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8000/api/login", loginData);
    console.log("Auth Token:", res.data.token); // ✅ LOG TOKEN HERE
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    setIsAuthenticated(true);
    setMessage("Login successful");
   navigate("/profile");
  } catch (err) {
    setMessage(err.response?.data?.message || "Login failed");
  }
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setMessage("Logged out successfully");
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

      // Auto-login after signup
      const loginRes = await axios.post("http://localhost:8000/api/login", {
        Email: signupData.Email,
        Password: signupData.Password,
      });

      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));
      setUser(loginRes.data.user);
      setIsAuthenticated(true);
      setMessage("Signup & login successful");
      setIsLogin(true);
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
            <button className="authbutton" type="submit">Log In</button>
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
            <button className="authbutton" type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Log in</span>
          </p>
        </div>
      </div>

      {/* MESSAGE */}
      {message && <p className="message">{message}</p>}

      {/* LOGOUT + USER INFO */}
      {isAuthenticated && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <p>Welcome, {user?.Name}!</p>
          <button className="authbutton" onClick={handleLogout} style={{ padding: "10px 20px" }}>
            Log Out
          </button>
        </div>
      )}
    </section>
  );
};

export default AuthForms;

