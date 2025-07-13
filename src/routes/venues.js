import express from 'express';
import { create, getAll, search, getById, update, remove } from '../controllers/venueController.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All venue routes require authentication
router.use(authenticateToken);

router.post('/', requireRole(['provider', 'admin']), create);
router.get('/search', search);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', requireRole(['provider', 'admin']), update);
router.delete('/:id', requireRole(['provider', 'admin']), remove);

export default router;
