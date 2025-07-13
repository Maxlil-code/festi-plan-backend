import express from 'express';
import { create, getAll, getOrganizerQuotes, getProviderQuotes, getById, accept, reject, negotiate } from '../controllers/quoteController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All quote routes require authentication
router.use(authenticateToken);

router.post('/', create);
router.get('/', getAll);
router.get('/organizer', requireRole(['organizer', 'admin']), getOrganizerQuotes);
router.get('/provider', requireRole(['provider', 'admin']), getProviderQuotes);
router.get('/:id', getById);
router.put('/:id/accept', requireRole(['organizer', 'admin']), accept);
router.put('/:id/reject', requireRole(['organizer', 'admin']), reject);
router.put('/:id/negotiate', negotiate);

export default router;
