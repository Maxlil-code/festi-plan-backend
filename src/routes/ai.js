import express from 'express';
import { getRecommendations, postQuote, analyzeEventRequirements } from '../controllers/aiController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// All AI routes require authentication
router.use(authenticateToken);

router.post('/recommendations', getRecommendations);
router.post('/generate-quote', postQuote);
router.post('/analyze-requirements', analyzeEventRequirements);

export default router;
