import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Search from './Search'; 
import useThemeStore from '../store/useThemeStore';

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const { theme } = useThemeStore()

  return (
    <div
      className={`${theme === 'dark' ? 'bg-black shadow-slate-700 text-white' : 'bg-white text-black shadow-black'} fixed top-0 left-0 w-70 h-full shadow-lg transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-70'
      } transition-transform duration-300 ease-in-out z-20 p-5`}
    >
      <button
        className="absolute top-4 right-4 text-2xl cursor-pointer text-slate-500 hover:text-red-500 transition-colors duration-200"
        onClick={closeSidebar}
      >
        <i className="fa-regular fa-circle-xmark"></i>
      </button>

      {showSearch ? (
        <Search onBack={() => setShowSearch(false)} />
      ) : (
        <ul className="mt-12 space-y-6">
          <li
            onClick={() => navigate('/')}
            className={`${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-200'} flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200`}
          >
            <i className="fa-solid fa-house"></i> Home
          </li>
          <li
            onClick={() => navigate('/profile')}
            className={`${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-200'} flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200`}
          >
            <i className="fa-solid fa-user"></i> Profile
          </li>
          <li
            onClick={() => setShowSearch(true)}
            className={`${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-200'} flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200`}
          >
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </li>
          <li
            onClick={() => {
              if (confirm('Are you sure you want to log out?')) {
                logout();
              }
            }}
            className={`${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-200'} flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200`}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Log out
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
