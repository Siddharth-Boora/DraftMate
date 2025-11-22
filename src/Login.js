import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import logo from "./logo.png"; // Make sure logo.png is in src folder

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation is handled by App.js state change
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-container animate-enter">
      {/* Logo at top-left */}
      <div className="login-logo">
        <Link to="/">
          <img src={logo} alt="DraftMate Logo" />
        </Link>
      </div>

      <form className="login-form animate-enter" onSubmit={handleLogin}>
        <h2 className="gradient-text">Sign In</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login-btn">Sign In</button>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Create Account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
