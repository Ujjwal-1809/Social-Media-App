import React, { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";
import useThemeStore from '../store/useThemeStore.js'

const ChatContainer = ({ chatId, onClose, selectedUser, profileImg }) => {
    const { messages, getMessages, sendMessage } = useChatStore();
    const [newMessage, setNewMessage] = useState("");
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null)
    const { theme } = useThemeStore()

    useEffect(() => {
        if (chatId) {
            getMessages(chatId); // Fetch messages when chat opens
        }
    }, [chatId, messages, getMessages, sendMessage]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages.length])

    
    const handleSendMessage = async () => {
        if (newMessage.trim() === "") return;
        
        await sendMessage(chatId, newMessage);
        setNewMessage("");
    };
    
    return (
        <div className={`${theme === 'dark' ? 'bg-black text-slate-300' : 'bg-white'} fixed bottom-0 sm:bottom-5 right-0 sm:right-5 w-full md:w-96 h-full md:h-[60%] lg:h-[60%] xl:h-[80%] shadow-lg rounded-0 sm:rounded-lg flex flex-col border border-gray-300`}>
            {/* Chat Header */}
            <div className={`${theme === 'dark' ? 'bg-black border-b border-slate-700' : 'bg-blue-600'} flex items-center justify-between p-3 text-white rounded-none sm:rounded-t-lg`}>
                <div className="flex items-center justify-center gap-x-2">
                    <img
                        src={profileImg}
                        alt="User"
                        className="w-6 h-6 object-cover rounded-full border border-gray-300"
                    />
                    <h2 className="text-lg font-semibold">
                        {selectedUser}
                    </h2>
                </div>
                <button onClick={onClose} className="text-white hover:text-red-500 transition duration-200 text-xl">
                    <i className="fa-solid fa-square-xmark text-2xl cursor-pointer"></i>

                </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg, index) => {
                    const isAuthenticatedUser = msg.sender._id === authUser._id;
                    return (
                        <div
                            ref={messageEndRef}
                            key={index}
                            className={`flex items-start ${isAuthenticatedUser ? "justify-end" : "justify-start"}`}
                        >
                            {!isAuthenticatedUser && (
                                <img
                                    src={msg.sender.profileImg}
                                    alt="User"
                                    className="w-6 h-6 mt-4 object-cover rounded-full mr-2 border border-gray-300"
                                />
                            )}
                         <div className="max-w-[70%]">
                         <div className="text-[8px] text-end mr-2 mb-0.5">{formatMessageTime(msg.timestamp)}</div>
                            <div
                                className={` px-3 py-2 rounded-lg text-sm ${isAuthenticatedUser
                                    ? "bg-blue-500 text-white self-end"
                                    : "bg-gray-200 text-black self-start"
                                    }`}
                            >
                                {msg.text}
                            </div>
                         </div>
                            {isAuthenticatedUser && (
                                <img
                                    src={authUser.profileImg}
                                    alt="User"
                                    className="w-6 h-6 mt-4 object-cover rounded-full ml-2 border border-gray-300"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Input Field */}
            <div className="p-3 border-t border-slate-700 flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className={`${theme === 'dark' ? 'text-white' : 'text-black'} flex-1 p-2 border rounded-md outline -outline-offset-1 outline-slate-700 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-400 placeholder:text-slate-700`}
                />
                <button
                    onClick={handleSendMessage}
                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 ml-2 rounded-md hover:bg-blue-600 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatContainer;
