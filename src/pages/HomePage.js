import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import logo from "../logo.png";
import TopicSuggester from "../components/TopicSuggester";
import "./HomePage.css";

function HomePage() {
    const auth = getAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const dropdownRef = useRef(null);

    const user = auth.currentUser;
    const firstName = user?.displayName?.split(" ")[0] || "User";
    const initial = firstName.charAt(0).toUpperCase();

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.className = theme;
    }, [theme]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    const tools = [
        {
            title: "Essay Checker",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#icon-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                </svg>
            ),
        },
        {
            title: "AI Checker",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#icon-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
            ),
        },
        {
            title: "Humanizer",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#icon-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
            ),
        },
        {
            title: "Summarizer",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#icon-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
            ),
        },
    ];

    // Mock Recent Docs - Initially empty as requested
    const [recentDocs, setRecentDocs] = useState([]);

    // You can uncomment this to test the populated state
    /*
    useEffect(() => {
      setRecentDocs([
        { id: 1, title: "History Essay Draft", preview: "The industrial revolution was a period of major industrialization...", date: "2 hours ago", type: "Essay" },
        { id: 2, title: "Biology Lab Report", preview: "In this experiment, we observed the effects of osmosis on...", date: "Yesterday", type: "Report" },
      ]);
    }, []);
    */

    const handleDocClick = (id) => {
        navigate(`/project/${id}`);
    };

    return (
        <div className={`homepage-container ${theme} animate-enter`}>
            {/* Gradient Definition for Icons */}
            <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true" focusable="false">
                <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4a00ff" />
                    <stop offset="100%" stopColor="#ff007a" />
                </linearGradient>
            </svg>

            {/* NAVBAR */}
            <nav className="navbar">
                <div className="logo" onClick={() => navigate("/home")}>
                    <img src={logo} alt="Logo" />
                    {/* Removed DraftMate text */}
                </div>

                {/* Profile dropdown */}
                <div className="profile-container" ref={dropdownRef}>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                        </svg>
                                        Dark Mode
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                {/* TOPIC SUGGESTER */}
                <TopicSuggester />

                {/* TOOLS SECTION */}
                <section className="tools-section">
                    <h2 className="section-title">Tools</h2>
                    <div className="tools-row">
                        {tools.map((tool, index) => (
                            <div key={index} className="tool-card">
                                <div className="tool-icon">{tool.icon}</div>
                                <span className="tool-title">{tool.title}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RECENT DOCS SECTION */}
                <section className="recent-section">
                    <h2 className="section-title">Recent Documents</h2>

                    {recentDocs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">👻</div>
                            <p className="empty-text">It's a ghost town in here!</p>
                            <p className="empty-sub">Start a new project and let's get those creative juices flowing.</p>
                        </div>
                    ) : (
                        <div className="docs-grid">
                            {recentDocs.map((doc) => (
                                <div key={doc.id} className="doc-card" onClick={() => handleDocClick(doc.id)}>
                                    <div className="doc-header">
                                        <span className="doc-type">{doc.type}</span>
                                        <span className="doc-date">{doc.date}</span>
                                    </div>
                                    <h3 className="doc-title">{doc.title}</h3>
                                    <p className="doc-preview">{doc.preview}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default HomePage;
