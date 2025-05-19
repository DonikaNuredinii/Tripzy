import React, { useState } from "react";
import "../CSS/Style.css";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className="auth-section">
      <div className={`form-container ${isLogin ? "" : "signup-mode"}`}>
        <div className="form-box login-form">
          <h2>Login</h2>
          <form>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Log In</button>
          </form>
          <p>
            Don't have an account?{" "}
            <span onClick={() => setIsLogin(false)}>Sign up</span>
          </p>
        </div>

        <div className="form-box signup-form">
          <h2>Sign Up</h2>
          <form>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="password" placeholder="Password" required />
            <input type="password" placeholder="Confirm Password" required />
            <input type="text" placeholder="Username" required />
            <input type="tel" placeholder="Phone Number (optional)" />
            <select required>
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not">Prefer not to say</option>
            </select>
            <input type="date" placeholder="Date of Birth" required />
            <button type="submit">Sign Up</button>
          </form>
          <p>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Log in</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthForms;
