import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";

const Following = ({ onClose }) => {
  const { authUser } = useAuthStore();
  const { theme } = useThemeStore()

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className={`${theme === 'dark' ? 'bg-black border border-slate-700' : 'bg-white'} w-[70%] sm:w-[50%] xl:w-[30%] p-6 rounded-lg shadow-lg relative max-h-80 overflow-y-auto`}>
      {/* Close Button */}
        <button
          onClick={onClose}
          className='text-gray-500 hover:text-red-500 transition duration-200 absolute top-2 right-2 text-xl cursor-pointer'
        >
         <i className="fa-solid fa-square-xmark text-2xl"></i>
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4">Following</h2>

        {authUser?.following?.length > 0 ? (
          <ul className="mt-2 space-y-3">
            {authUser.following.map((user) => (
              <li
                key={user._id || user.username}
                className={`${theme === 'dark' ? 'bg-black border border-slate-700' : 'bg-gray-100'} flex items-center p-3 rounded-lg shadow-sm`}
              >
                <img
                  src={user.profileImg || "/avatar.png"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                />
                <span className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ml-3 text-lg font-medium`}>
                {user.username}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 mt-2">No following yet.</p>
        )}
      </div>
    </div>
  );
};

export default Following;
