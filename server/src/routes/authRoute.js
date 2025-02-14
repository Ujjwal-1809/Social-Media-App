import express from 'express'
import { protectedRoute } from '../middleware/protectedRoute.js';
import { checkAuth, forgotPassword, handleLogin, handleLogout, handleSignup, resetPassword } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', handleSignup)
router.post('/login', handleLogin)
router.post('/logout', handleLogout)
router.get('/check', protectedRoute, checkAuth)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router