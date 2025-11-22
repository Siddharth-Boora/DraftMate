import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import logo from "./logo.png";
import SignUp from "./pages/SignUp";
import Login from "./Login";
import HomePage from "./pages/HomePage";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>; // Or a spinner
  }

  return (
    <Router>
      {/* Global decorative splotches (rendered outside Routes so they appear on every page) */}
      <div className="splotch splotch1" aria-hidden="true" />
      <div className="splotch splotch2" aria-hidden="true" />
      <div className="splotch splotch3" aria-hidden="true" />

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/home" />
            ) : (
              <div className="App animate-enter">
                {/* NAVBAR */}
                <nav className="navbar animate-enter">
                  <div className="logo">
                    <a href="/">
                      <img src={logo} alt="DraftMate Logo" />
                    </a>
                  </div>

                  <div className="nav-center">
                    <button className="nav-item">About</button>
                    <button className="nav-item">Features</button>
                    <button className="nav-item">FAQ</button>
                    <button className="nav-item">Updates</button>
                  </div>

                  <a href="/login">
                    <button className="login-btn">Sign In</button>
                  </a>
                </nav>

                {/* HERO SECTION */}
                <section className="hero animate-enter">
                  <h1 className="hero-title">
                    <span className="gradient-text">Draft Smarter, Say It Better</span>
                  </h1>
                  <p className="hero-subtitle">
                    AI-powered writing assistant for essays, articles, and more.
                  </p>
                  <a href="/signup">
                    <button className="hero-cta">Get Started</button>
                  </a>
                </section>
              </div>
            )
          }
        />

        {/* LOGIN PAGE */}
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />

        {/* SIGNUP PAGE - Allow access even if technically "logged in" momentarily during creation */}
        <Route path="/signup" element={<SignUp />} />

        {/* HOME PAGE */}
        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/" />}
        />

        {/* Redirect old dashboard route to home just in case */}
        <Route path="/dashboard" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;
