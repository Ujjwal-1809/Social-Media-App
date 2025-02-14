import express from 'express'
import { protectedRoute } from '../middleware/protectedRoute.js';
import { handleCreatePost, handleDeletePost, handleGetPost, handleLikedPost, handlePostComments, handleUpdatePost } from '../controllers/postController.js';
const router = express.Router();

router.post('/create', protectedRoute, handleCreatePost);
router.get('/view-posts', protectedRoute, handleGetPost);
router.put('/:postId', protectedRoute, handleUpdatePost);
router.delete('/:postId', protectedRoute, handleDeletePost);
router.put("/like/:postId", protectedRoute, handleLikedPost);
router.post("/:postId/comment", protectedRoute, handlePostComments);


export default router