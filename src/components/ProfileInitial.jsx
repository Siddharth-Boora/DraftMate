import React from "react";

// Simplify: always use the same dark purple for profile initials per user
const DEFAULT_PURPLE = "#4a00ff";

export default function ProfileInitial({ initial, size = 40 }) {
  const style = {
    width: size,
    height: size,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: Math.max(12, Math.floor(size / 2.5)),
    background: DEFAULT_PURPLE,
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  };

  return <div className="profile-initial" style={style}>{initial || ""}</div>;
}
