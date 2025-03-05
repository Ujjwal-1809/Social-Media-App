import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Camera, Loader2, Mail, User } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import { useSidebarStore } from "../store/useSidebarStore";
import Sidebar from "./Sidebar";
import { usePostStore } from "../store/usePostStore.js";
import Followers from "./Followers.jsx";
import Following from "./Following.jsx";
import useThemeStore from "../store/useThemeStore.js";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, isUpdatingProfilePic, updateProfilePic } = useAuthStore();
  const { posts, getPosts } = usePostStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [formData, setFormData] = useState({
    username: authUser?.username || "",
    bio: authUser?.bio || "",
  });
  const [followersList, showFollowersList] = useState(false);
  const [followingList, showFollowingList] = useState(false);
  const { theme } = useThemeStore()

  useEffect(() => {
    getPosts(); // Fetch posts when the component mounts
  }, []);

  const { isSidebarOpen, closeSidebar } = useSidebarStore();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
  
    setFormData(updatedFormData);
 
    // Check if any changes are made AND username has at least 5 characters
    setIsChanged(
      (updatedFormData.username !== authUser.username || updatedFormData.bio !== authUser.bio) &&
      updatedFormData.username.length >= 5
    );
  };


  // Handle Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfilePic({ profileImg: base64Image });
    };
  };

  // Handle Profile Update
  const handleUpdateProfile = async () => {

    await updateProfile(formData);
    setIsEditing(false);
    setIsChanged(false); // Reset change tracker after update
  };


  const handleFollowersList = () => {
    showFollowersList(true)
  }

  const handleFollowingList = () => {
    showFollowingList(true)
  }

  return (
    <div>
      <Navbar />
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      <div className="h-auto p-4 mt-16">
        <div className={`${theme === "dark" ? "bg-black text-white border border-slate-700" : "bg-zinc-200 text-black"} max-w-2xl mx-auto p-4 py-8 transition-all duration-300 rounded-3xl`}>
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profileImg || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-[-4px]
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingProfilePic ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-8 h-8 bg-slate-100 border rounded-full p-1 text-black" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfilePic}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfilePic ? "Uploading..." : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="flex justify-between w-full items-center py-4 text-center">
              <div>
                <h2 className="text-xl font-semibold">
                  {posts.filter((post) => post.createdBy._id === authUser?._id).length}
                </h2>
                <p className="text-sm text-zinc-500">Posts</p>
              </div>
              <div onClick={handleFollowersList} className="ml-7 cursor-pointer">
                <h2 className="text-xl font-semibold">{authUser?.followers?.length || 0}</h2>
                <p className="text-sm text-zinc-500">Followers</p>
              </div>
              <div onClick={handleFollowingList} className="cursor-pointer">
                <h2 className="text-xl font-semibold">{authUser?.following?.length || 0}</h2>
                <p className="text-sm text-zinc-500">Following</p>
              </div>
            </div>

            {followersList && (
              <Followers onClose={() => showFollowersList(false)} />
            )}

            {followingList && (
              <Following onClose={() => showFollowingList(false)} />
            )}

            {/* Profile Form */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </div>
                <input
                minLength='5'
                  name="username"
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full outline-2 -outline-offset-1 outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  readOnly={!isEditing}
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Bio
                </div>
                <textarea
                  name="bio"
                  className="px-4 py-2.5 bg-base-200 rounded-lg border w-full outline-2 -outline-offset-1 outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400 h-[30vh]"
                  value={formData.bio}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  placeholder="Write about yourself in less than 50 words..."
                  maxLength='50'
                />
              </div>

            </div>

            {/* show authenticated user's posts */}
            <h1 className="text-center font-semibold text-2xl mb-6">Posts</h1>

            {posts.length > 0 ? (
              posts.filter(post => post.createdBy._id === authUser._id).length > 0 ? (
                <div className="grid grid-cols-2 gap-4 p-4">
                  {posts
                    .filter(post => post.createdBy._id === authUser._id)
                    .map(post => (
                      <div key={post._id} className="transition-transform duration-300 hover:scale-102 w-full aspect-square bg-gray-100 shadow-md overflow-hidden">
                        <img
                          src={post.image}
                          alt="Post"
                          className="w-full h-full object-cover "
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <h1 className="text-center text-gray-500">No posts</h1>
              )
            ) : (
              <h1 className="text-center text-gray-500">No posts available</h1>
            )}



            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-3">
              {isEditing ? (
                <>
                  <button
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-800"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-white
  ${isChanged ? "bg-blue-500 hover:bg-blue-600 cursor-pointer " : "bg-gray-400 cursor-not-allowed"}`}
                    onClick={handleUpdateProfile}
                    disabled={!isChanged || isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Update Profile"
                    )}
                  </button>

                </>
              ) : (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {/* Account Information */}
            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
