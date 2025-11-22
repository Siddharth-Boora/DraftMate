import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile, signOut } from "firebase/auth";
import logo from "../logo.png"; // Make sure logo.png is in src folder
import formatError from "../utils/formatError";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  // Removed 'created' state and confetti logic as we redirect immediately

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setError("An account with this email already exists.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}` });

      // Immediately sign out to prevent auto-login
      await signOut(auth);

      // Redirect to login page
      navigate("/login");

    } catch (err) {
      setError(formatError(err));
    }
  };

  return (
    <div className="signup-container animate-enter">
      {/* Logo at top-left */}
      <div className="signup-logo">
        <Link to="/">
          <img src={logo} alt="DraftMate Logo" />
        </Link>
      </div>

      <form className="signup-form animate-enter" onSubmit={handleSubmit}>
        <h2 className="gradient-text">Create Account</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <p className="terms">
          By signing up you agree to our {" "}
          <a href="#">Terms of Service</a> and {" "}
          <a href="#">Privacy Policy</a>.
        </p>

        <button type="submit" className="signup-btn">Sign Up</button>

        <p className="login-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
