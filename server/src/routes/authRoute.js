import express from 'express'
import { protectedRoute } from '../middleware/protectedRoute.js';
import { checkAuth, forgotPassword, getUserList, handleFollow, handleLogin, handleLogout, handleSignup, handleUnfollow, resetPassword, updateProfile, updateProfilePic } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', handleSignup)
router.post('/login', handleLogin)
router.post('/logout', handleLogout)
router.get('/check', protectedRoute, checkAuth);
router.put('/profile-image', protectedRoute, updateProfilePic)
router.put('/update-profile', protectedRoute, updateProfile)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/users', protectedRoute, getUserList);
router.put("/:userId/follow", protectedRoute, handleFollow);
router.put("/:userId/unfollow", protectedRoute, handleUnfollow);
  

export default router