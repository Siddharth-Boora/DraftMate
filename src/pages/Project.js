import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "./Project.css";

export default function Project() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // navigate to landing page after sign out so navbar returns to public state
      navigate("/");
    } catch (e) {
      console.error("Sign out error", e);
    }
  };

  return (
    <div className="project-root">
      <header className="project-header">
        <h1>Project Dashboard</h1>
        <button className="logout-btn" onClick={handleSignOut}>Sign Out</button>
      </header>

      <main className="project-main">
        <p>Welcome to your project space. This page is protected and requires authentication.</p>
        <p>Replace this with your actual app content.</p>
      </main>
    </div>
  );
}
