import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import logo from "./logo.png";
import SignUp from "./pages/SignUp";
import Login from "./Login";

function App() {
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
            <div className="App">
              {/* NAVBAR */}
              <nav className="navbar">
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
              <section className="hero">
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
          }
        />

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login />} />

        {/* SIGNUP PAGE */}
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
