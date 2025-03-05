import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "../store/usePostStore";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Comment from "../components/Comment"; // Import Comment component
import { useSidebarStore } from "../store/useSidebarStore";
import Sidebar from "./Sidebar";
import SearchedUserProfile from "./SearchedUserProfile";
import toast from 'react-hot-toast';
import useThemeStore from "../store/useThemeStore";

const ViewPosts = () => {
  const { posts, getPosts, isLoadingPosts, likePost, deletePost, addComment, subscribeToUpdates } = usePostStore();
  const { authUser, followUser, unfollowUser } = useAuthStore();
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const { isSidebarOpen, closeSidebar } = useSidebarStore();
  const [searchedUserProfile, showSearchedUserProfile] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(null); // Track loading state per user
  const { theme } = useThemeStore()

  useEffect(() => {
    getPosts();
    subscribeToUpdates();
  }, [getPosts]);

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
    <div className="w-full mt-10 pb-10 py-10 pl-0 flex">
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {isLoadingPosts ? (
        <div className="flex justify-center items-center h-[calc(100vh-114px)] w-full">
          <Loader className="size-22 animate-spin text-blue-600" />
        </div>
      ) : posts.length === 0 ? (
         <p className="text-gray-500 flex justify-center w-full text-2xl h-[calc(100vh-120px)] text-center italic">
          No posts are available. <br /> Create a post.
        </p>
        
      ) : (
        <div className="flex w-full">
          <div className="grid grid-cols-1 justify-items-center w-full gap-y-5 theme">
            {posts.map((post) => {
              const isLiked = Array.isArray(post.likes) && post.likes.includes(authUser._id);
              const isFollowing = authUser?.following?.some(followedUser => followedUser._id === post.createdBy._id);

              const handleLike = async () => {
                await likePost(post._id);
              };

              const date = new Date(post.createdAt?.split("T")[0]);
              const formattedDate = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              });

              const displaySearchedUserProfile = () => {
                if (authUser._id !== post.createdBy._id) {
                  showSearchedUserProfile(true)
                  setSelectedUser(post.createdBy)
                }
                else {
                  navigate('/profile')
                }
              }

              return (
                <div key={post._id} className={`${theme === "dark" ? "bg-black text-white border border-slate-700" : "bg-white"} transition-all duration-300 w-[90%] xl:w-[50%] h-auto shadow-2xl rounded-xl p-5 hover:shadow-2xl`}>
                  <div className="flex items-center justify-between">
                    <div onClick={displaySearchedUserProfile} className="cursor-pointer flex items-center gap-x-2">
                      <img className="h-7 w-7 rounded-full object-cover border border-white" src={post.createdBy?.profileImg || "/avatar.png"} alt="USER Img" />
                      <h2 className="font-semibold text-sm">{post.createdBy.username}</h2>
                    </div>
                    {authUser._id !== post.createdBy._id && (
                      <button
                        disabled={loadingUserId === post.createdBy._id}
                        onClick={() => handleFollowToggle(post.createdBy._id, isFollowing, post.createdBy.username)}
                        className={`px-4 py-1 text-sm cursor-pointer font-medium rounded transition-all duration-300 ${isFollowing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                      >
                        {loadingUserId === post.createdBy._id ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          `${isFollowing ? 'Following' : 'Follow'}`
                        )}
                      </button>
                    )}
                    {authUser.username === post.createdBy.username && (
                      <button
                        type="button"
                        className="text-lg font-semibold relative group"
                        onClick={() => navigate(`/edit/${post._id}`)}
                      >
                        <i className="fa-solid fa-pen cursor-pointer"></i>
                        <div className={`${theme === "dark" ? "text-black bg-white" : "text-slate-100 bg-gray-900"} hidden sm:block absolute right-[-20px] bottom-8 w-max px-2 py-1 text-xs rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                          Edit Post
                        </div>
                      </button>
                    )}
                  </div>

                  {post.image && (
                    <img src={post.image} alt="Post" className="h-[50vh] sm:h-[60vh] w-full object-cover rounded-lg mt-3" />
                  )}

                  <p className={`${theme === "dark" ? "text-white": "text-gray-700"} italic font-semibold leading-relaxed mt-3`}>{post.content}</p>

                  <div className="flex mt-3">
                    <div className="flex text-lg items-center justify-between w-full">
                      <div className="flex items-center gap-x-4">
                        <i onClick={handleLike} className={`cursor-pointer text-xl ${isLiked ? "fa-solid fa-heart text-red-500" : "fa-regular fa-heart"}`}></i>
                        <h3>
                          <i onClick={() => setSelectedPost(post)} className="fa-regular fa-comment cursor-pointer text-xl"></i>
                        </h3>
                      </div>

                      {authUser.username === post.createdBy.username && (
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this post?")) {
                              deletePost(post._id);
                            }
                          }}
                          className="bg-red-500 text-xs p-2 cursor-pointer font-semibold text-white rounded-3xl hover:bg-red-600"
                        >
                          Delete Post &nbsp; <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold mt-2">Liked by {post.likes.length}</h3>
                  <span className="text-zinc-400 text-[10px] font-semibold">{formattedDate}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {searchedUserProfile && (
        <SearchedUserProfile onClose={() => showSearchedUserProfile(false)} selectedUser={selectedUser} />
      )}
      {/* Comments Modal */}
      {selectedPost && <Comment post={selectedPost} onClose={() => setSelectedPost(null)} addComment={addComment} />}

    </div>
  );
};

export default ViewPosts;
