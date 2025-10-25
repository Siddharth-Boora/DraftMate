import React from "react";
import "./index.css";
import logo from "./logo.png"; // Make sure your logo.png is in the src folder

function App() {
  return (
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

        <button className="login-btn">Log In</button>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <h1 className="hero-title">
        <span className="gradient-text">Draft Smarter, Say It Better</span>
        </h1>
        <p className="hero-subtitle">
          AI-powered writing assistant for essays, articles, and more.
        </p>
        <button className="hero-cta">Get Started</button>
      </section>
    </div>
  );
}

export default App;
