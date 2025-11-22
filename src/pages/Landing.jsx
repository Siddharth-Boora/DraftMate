import React from "react";
import { Link } from "react-router-dom";
import "../index.css";
import Navbar from "../components/Navbar";

export default function Landing() {
  return (
    <div className="App animate-enter">
      {/* Use the existing Navbar component so landing matches the site's navbar */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero animate-enter">
        <h1 className="hero-title">
          <span className="gradient-text">Draft Smarter, Say It Better</span>
        </h1>
        <p className="hero-subtitle">
          AI-powered writing assistant for essays, articles, and more.
        </p>
        <Link to="/signup">
          <button className="hero-cta">Get Started</button>
        </Link>
      </section>
    </div>
  );
}
