import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import logo from "../logo.png";
import "./Dashboard.css";

function Dashboard() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = auth.currentUser;
  const firstName = user?.displayName?.split(" ")[0] || "User";
  const initial = firstName.charAt(0).toUpperCase();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/dashboard")}>
          <img src={logo} alt="Logo" />
          <span>DraftMate</span>
        </div>

        {/* Profile dropdown */}
        <div className="profile-container">
          <div className="profile" onClick={toggleDropdown}>
            <div className="pfp">{initial}</div>
            <span className="name">{firstName}</span>
            <div className={`dropdown-arrow ${dropdownOpen ? "open" : ""}`}>▼</div>
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="logout-btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="content">
        <h1>Welcome, {firstName}!</h1>
        <p>You're now logged in ✅</p>
      </div>
    </div>
  );
}

export default Dashboard;
