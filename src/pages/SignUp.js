import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, updateProfile } from "firebase/auth";
import logo from "../logo.png"; // Make sure logo.png is in src folder
import formatError from "../utils/formatError";

function SignUp() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!created) return;

    // generate simple confetti pieces
    const colors = ["#4a00ff", "#ff007a", "#00c4ff", "#ffd166", "#06d6a0"];
    const pieces = Array.from({ length: 30 }).map(() => ({
      left: Math.random() * 100 + "vw",
      delay: Math.random() * 0.6 + "s",
      duration: 3 + Math.random() * 2 + "s",
      bg: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 12 + "px",
      rotate: Math.random() * 360 + "deg",
    }));
    setConfetti(pieces);

    // clear confetti after animation
    const t = setTimeout(() => setConfetti([]), 7000);
    return () => clearTimeout(t);
  }, [created]);

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
      // Mark account as created and show the success box
      setCreated(true);
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
      {created ? (
        <>
          <div className="success-box animate-enter">
            <h2 className="gradient-text">Account created successfully</h2>
            <p className="success-sub">You can now <Link to="/login">sign in</Link>.</p>
          </div>
          <div className="confetti-root" aria-hidden="true">
            {confetti.map((c, i) => (
              <span
                key={i}
                className="confetti"
                style={{
                  left: c.left,
                  background: c.bg,
                  width: c.size,
                  height: c.size,
                  animationDelay: c.delay,
                  animationDuration: c.duration,
                  transform: `rotate(${c.rotate})`,
                }}
              />
            ))}
          </div>
        </>
      ) : (
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
      )}
    </div>
  );
}

export default SignUp;
