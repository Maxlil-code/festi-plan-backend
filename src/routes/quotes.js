import express from 'express';
import { create, getAll, accept, reject, negotiate } from '../controllers/quoteController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All quote routes require authentication
router.use(authenticateToken);

router.post('/', requireRole(['provider', 'admin']), create);
router.get('/', getAll);
router.put('/:id/accept', requireRole(['organizer', 'admin']), accept);
router.put('/:id/reject', requireRole(['organizer', 'admin']), reject);
router.put('/:id/negotiate', negotiate);

export default router;
