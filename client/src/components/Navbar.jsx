import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const Navbar = () => {

    const { logout } = useAuthStore()

  return (
    <nav className="h-16 bg-white shadow-lg w-full flex justify-between items-center p-4">
  {/* Logo */}
  <Link 
    to="/" 
    className="text-lg cursor-pointer text-blue-900 font-bold sm:text-2xl"
  >
    <i className="fa-solid fa-camera"></i> PostIT
  </Link>

  {/* Buttons */}
  <div className="flex gap-x-3.5">
    <Link 
      to="/create"
      className="rounded-xl border-2 p-2 bg-white text-black border-gray-700 hover:bg-black hover:text-white 
                 sm:text-sm sm:p-1.5 sm:rounded-lg"
    >
      Create Post &nbsp;<i className="fa-solid fa-plus"></i>
    </Link>
    <button 
      onClick={logout}
      className="rounded-xl cursor-pointer border-2 p-2 bg-white text-black border-gray-700 hover:bg-black hover:text-white
                 sm:text-sm sm:p-1.5 sm:rounded-lg"
    >
      Logout &nbsp; <i className="fa-solid fa-right-from-bracket"></i>
    </button>
  </div>
</nav>
  )
}

export default Navbar