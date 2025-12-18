import express from 'express';
import { register, login, refresh, verify, getMe, updateUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.post('/verify', authenticate, verify);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateUser);

export default router;
