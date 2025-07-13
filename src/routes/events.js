import express from 'express';
import { create, getAll, getById, update, remove } from '../controllers/eventController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All event routes require authentication
router.use(authenticateToken);

router.post('/', requireRole(['organizer', 'admin']), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', requireRole(['organizer', 'admin']), update);
router.patch('/:id', requireRole(['organizer', 'admin']), update);
router.delete('/:id', requireRole(['organizer', 'admin']), remove);

export default router;
