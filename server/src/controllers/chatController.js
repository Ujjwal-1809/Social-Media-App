import Chat from '../models/chatModel.js'
import User from '../models/userModel.js'

export const handleChat = async (req, res) => {
  const { userId } = req.body; // The ID of the user to chat with
  const authUserId = req.user._id; // The ID of the authenticated user

  try {
    let chat = await Chat.findOne({
      participants: { $all: [authUserId, userId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [authUserId, userId],
        messages: [],
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}

export const handleSendMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const senderId = req.user._id;

  try {
      const chat = await Chat.findById(chatId);
      if (!chat) return res.status(404).json({ error: "Chat not found" });

      const sender = await User.findById(senderId).select("username profileImg"); 
      const newMessage = { sender, text, timestamp: Date.now() };

      chat.messages.push(newMessage);
      await chat.save();

      // Emit message with sender details
      req.io.to(chatId).emit("receive-message", newMessage);

      res.status(200).json(newMessage);
  } catch (error) {
      res.status(500).json({ error: "Server Error" });
  }
};


export const getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId).populate("messages.sender", "username profileImg");
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
}