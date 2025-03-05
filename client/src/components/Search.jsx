import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import SearchedUserProfile from './SearchedUserProfile';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';

const Search = ({ onBack }) => {
  const { users, getUsers, authUser, followUser, unfollowUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchedUserProfile, showSearchedUserProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loadingUserId, setLoadingUserId] = useState(null); // Track loading state per user
  const navigate = useNavigate();
  const { theme } = useThemeStore()

  useEffect(() => {
    getUsers(); // Fetch users when the component mounts
  }, [getUsers]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
        // filtered = that user which is being searched in a search bar.

      );
      setFilteredUsers(filtered); // the value of filteredUsers from useState stores that searched user.
    }
  }, [searchTerm, users]);

  const handleFollowToggle = async (userId, isFollowing, username) => {
    //   /*userId = searched user'sId.
  //   isFollowing = it is basically a Boolean value which returns true if followed userId === searched users'Id after checking from the following list of current authenticated user. (authUser.following gives the following list)
  //   username = searched user's name.*/

    if (loadingUserId) return; // Prevent multiple clicks
  
    setLoadingUserId(userId); // Set loading state for the specific user
  
    try {
      if (isFollowing) {
        await unfollowUser(userId); // if searched user'sId is already in authenticated user's following list, then user should be unfollowed (comes from useAuthStore.js) after a button click.
        toast.success(`You unfollowed ${username}`);
      } else {
        await followUser(userId);
        toast.success(`You started following ${username}`);
      }
    } finally {
      setLoadingUserId(null); // Reset loading state after API call
    }
  };


  return (
    <div>
      <button onClick={onBack} className={`${theme === 'dark' ? 'text-white' : 'text-slate-700'} mb-4`}>
        <i className="fa-solid fa-arrow-left cursor-pointer text-xl"></i>
      </button>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} w-full p-2 rounded border border-gray-500 outline -outline-offset-1 outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400`}
      />
      <ul className="mt-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isFollowing = authUser?.following?.some(followedUser => followedUser._id === user._id);
            const displaySearchedUserProfile = () => {
              if (authUser._id !== user._id) {
                showSearchedUserProfile(true)
                setSelectedUser(user)
              }
              else {
                navigate('/profile')
              }
            }

            return (
              <div key={user._id}>
                <li
                  className="flex items-center justify-between p-3 bg-gray-800 rounded mt-2 shadow-md hover:bg-gray-700 transition"
                >
                  <div onClick={displaySearchedUserProfile} className='flex items-center justify-center gap-x-2.5 cursor-pointer'>
                    <img
                      src={user.profileImg || "/avatar.png"}
                      alt={user.username}
                      className="w-6 h-6 rounded-full object-cover border-2 border-gray-300"
                    />
                    <span className="text-white font-medium">{user.username}</span>
                  </div>
                  {authUser._id !== user._id && (
                   <button
                   disabled={loadingUserId === user._id}
                   onClick={() => handleFollowToggle(user._id, isFollowing, user.username)}
                   className={`px-4 py-1 text-sm cursor-pointer font-medium rounded transition-all duration-300 ${
                     isFollowing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-blue-500 text-white hover:bg-blue-600'
                   }`}
                 >
                   {loadingUserId === user._id ? (
                     <Loader className="h-5 w-5 animate-spin" />
                   ) : (
                     `${isFollowing ? 'Following' : 'Follow'}`
                   )}
                 </button>
                 
                  )}
                </li>

                {searchedUserProfile && (
                  <SearchedUserProfile onClose={() => showSearchedUserProfile(false)} selectedUser={selectedUser} />
                )}
              </div>

            );
          })
        ) : searchTerm ? (
          <p className="text-gray-400 mt-2">No users found</p>
        ) : null}
      </ul>
    </div>

  );
};

export default Search;
