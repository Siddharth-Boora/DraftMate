import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-sm bg-transparent flex items-center justify-between px-10 py-4 z-50">
      
      {/* Logo */}
      <div className="flex items-center">
        <img 
          src="/logo.png" 
          alt="DraftMate Logo" 
          className="w-[125px] h-auto" 
        />
      </div>

      {/* Center Menu */}
      <div className="flex space-x-10 text-black font-medium text-lg">
        <button className="hover:opacity-70 transition">Option 1</button>
        <button className="hover:opacity-70 transition">Option 2</button>
        <button className="hover:opacity-70 transition">Option 3</button>
      </div>

      {/* Login Button */}
      <div>
        <button className="bg-[#4a00ff] text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:opacity-90 transition">
          Log In
        </button>
      </div>

    </nav>
  );
};

export default Navbar;
