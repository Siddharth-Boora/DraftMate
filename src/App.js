import React from "react";
import "./index.css";
import logo from "./logo.png"; // Make sure logo.png is in src folder

function App() {
  return (
    <div>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo-container">
          <a href="/">
            <img src={logo} alt="DraftMate Logo" className="logo" />
          </a>
        </div>

        {/* Center nav items */}
        <div className="nav-center">
          <button className="nav-item">Option 1</button>
          <button className="nav-item">Option 2</button>
          <button className="nav-item">Option 3</button>
        </div>

        {/* Login button */}
        <div className="login-container">
          <button className="login-btn">Log In</button>
        </div>
      </nav>

      {/* Example content */}
      <div style={{ paddingTop: "100px", textAlign: "center" }}>
        <h1>Landing Page Content Goes Here</h1>
      </div>
    </div>
  );
}

export default App;
