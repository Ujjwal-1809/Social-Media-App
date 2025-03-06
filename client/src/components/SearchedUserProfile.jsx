import React, { useState } from "react";
import { createPortal } from "react-dom";
import { usePostStore } from "../store/usePostStore";
import ChatContainer from "./ChatContainer";  
import { useChatStore } from "../store/useChatStore";
import useThemeStore from '../store/useThemeStore';

const SearchedUserProfile = ({ onClose, selectedUser }) => {
    const { posts } = usePostStore();
    const { getChat, chat } = useChatStore(); // Get chat from Zustand
    const [showChat, setShowChat] = useState(false);
    const { theme } = useThemeStore()    

    const selectedUserPosts = posts
        .filter((post) => post.createdBy._id === selectedUser._id)
        .map((post) => post.image);

    const openChat = async () => {
        await getChat(selectedUser._id);  
        setShowChat(true);  // Open chat container after fetching chat
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
            <div className={`${theme === 'dark' ? 'bg-black text-white border-slate-600' : 'bg-white border-slate-300'} w-[90%] md:w-[70%] xl:w-[35%] h-[85vh] shadow-lg rounded-lg flex flex-col p-5 relative overflow-hidden border`}>
                {/* Close Button */}
                <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition duration-200" onClick={onClose}>
                    <i className="fa-solid fa-square-xmark text-2xl cursor-pointer"></i>
                </button>

                {/* User Profile Image */}
                <img className="w-24 h-24 aspect-square object-cover border-2 self-center rounded-full shadow-md" src={selectedUser.profileImg || '/avatar.png'} />

                {/* User Info */}
                <h2 className="text-center font-semibold text-lg">{selectedUser.username}</h2>
                <pre className="text-center text-sm text-gray-600 mt-2">{selectedUser.bio}</pre>

                <button 
  className="w-[60%] self-center m-2 flex items-center justify-center gap-2 
             bg-blue-600 hover:bg-blue-700 text-white font-medium 
             px-4 py-2 rounded-xl shadow-md transition-all duration-300 cursor-pointer"
  onClick={openChat}
>
  <i className="fa-solid fa-comments"></i> 
  Send Message
</button>


                <h2 className="self-center text-center font-bold text-slate-500 mt-2 border-t w-[70%]">Posts <i className="fa-solid fa-images"></i></h2>

                {/* Posts Container */}
                <div className="mt-3 overflow-y-auto h-full w-[70%] self-center border-gray-300">
                    {selectedUserPosts.length > 0 ? (
                        selectedUserPosts.map((post, index) => (
                            <img key={index} src={post} alt={`Post ${index + 1}`} className="w-full h-[40%] xl:h-[80%] object-cover rounded-md mb-2 border border-slate-700" />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No posts available</p>
                    )}
                </div>
            </div>

            {/* Open chat container only if chat exists */}
            {showChat && chat && <ChatContainer chatId={chat._id} onClose={() => setShowChat(false)} selectedUser={selectedUser.username} profileImg={selectedUser.profileImg}/>}
        </div>,
        document.body
    );
};

export default SearchedUserProfile;
