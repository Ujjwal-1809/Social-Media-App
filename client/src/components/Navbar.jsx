import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSidebarStore } from '../store/useSidebarStore'; // Import the sidebar store
import useThemeStore from '../store/useThemeStore';
import {  MoonStar, Sun } from "lucide-react";

const Navbar = () => {
  const { toggleSidebar } = useSidebarStore(); // Access toggle function
  const { theme, setTheme } = useThemeStore();
  const [ currentTheme, setCurrentTheme ] = useState(false);

  const toggleTheme = () => {
    setCurrentTheme(prev => !prev)
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <nav className={`${theme === "dark" ? "bg-black text-white border-b border-slate-700" : "bg-white text-black"} transition-all duration-300 h-16 shadow-lg w-full flex justify-between items-center p-4 fixed top-0 z-10`}>
      <i className="fa-solid fa-bars text-2xl cursor-pointer" onClick={toggleSidebar}></i>
      {/* Buttons */}
      <div className="flex gap-x-3.5 items-center">
        <Link 
          to="/create"
          className="flex items-center gap-2 px-2 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white 
          font-medium rounded-lg shadow-md border border-transparent transition-all duration-300
          hover:from-pink-500 hover:to-red-500 hover:scale-105 "
        >
          Create Post <i className="fa-solid fa-plus"></i>
        </Link>
        
        <div 
  onClick={toggleTheme} 
  className="cursor-pointer relative w-8 h-8 flex items-center"
>
  <Sun 
    className={`absolute transition-all duration-500 transform ${
      currentTheme ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 rotate-45"
    } text-orange-500`}
  />
  
  <MoonStar
    className={`absolute transition-all duration-500 transform ${
      currentTheme ? "opacity-0 scale-0 -rotate-45" : "opacity-100 scale-100 rotate-0"
    } text-blue-500`}
  />
</div>




      </div>
    </nav>
  );
};

export default Navbar;
