import { create } from "zustand";
import { axiosInstance } from '../lib/axios.js'
import { socket } from '../lib/socket.js'

export const useChatStore = create((set, get) => ({
  chat: null,
  messages: [],
  socket,  // Store socket instance globally

  // Get or create a chat with a user
  getChat: async (userId) => {
    const { data } = await axiosInstance.post("/api/chat", { userId });
    set({ chat: data });

    // Join the chat room once the chat is fetched
    socket.emit("join-chat", data._id);
  },

  // Fetch chat messages
  getMessages: async (chatId) => {
    const { data } = await axiosInstance.get(`/api/messages/${chatId}`);
    set({ messages: data });

    // Prevent multiple event listeners
    socket.off("receive-message");

    socket.on("receive-message", (message) => {
        set((state) => {
            //  Avoid duplicate messages
            if (state.messages.some((msg) => msg._id === message._id)) return state;
            return { messages: [...state.messages, message] };
        });
    });
},

  // Send a message and emit it via Socket.io
  sendMessage: async (chatId, text) => {
    if (!chatId || !text) return; // Prevent empty messages

    const { data } = await axiosInstance.post("/api/send-message", { chatId, text });
    // Emit message only (do not update state manually)
    socket.emit("send-message", { chatId, message: data });
},
}));