import express from 'express'
import { protectedRoute } from '../middleware/protectedRoute.js';
import { getMessages, handleChat, handleSendMessage } from '../controllers/chatController.js';

const router = express.Router();

router.post("/chat", protectedRoute, handleChat);
router.post("/send-message", protectedRoute, handleSendMessage);
router.get("/messages/:chatId", protectedRoute, getMessages);


export default router