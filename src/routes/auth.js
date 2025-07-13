import express from 'express';
import { register, login, refresh } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', authenticateToken, refresh);

export default router;
