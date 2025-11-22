import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import logo from "../logo.png";
import "./Dashboard.css";

function Dashboard() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const user = auth.currentUser;
  const firstName = user?.displayName?.split(" ")[0] || "User";
  const initial = firstName.charAt(0).toUpperCase();

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme; // Optional: apply to body if needed globally, but we'll scope to container
  }, [theme]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
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
    <div className={`dashboard-container ${theme} animate-enter`}>
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
              <button className="theme-btn" onClick={toggleTheme}>
                {theme === "light" ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    Dark Mode
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    Light Mode
                  </>
                )}
              </button>
              <div className="dropdown-divider"></div>
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
