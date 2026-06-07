import { Router } from 'express';
import { getMe, getAllUsers, getUserStats } from '../controllers/user.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = Router();

router.get('/me', authenticateUser, getMe);
router.get('/stats', authenticateUser, authorizeRoles('admin'), getUserStats);
router.get('/', authenticateUser, authorizeRoles('admin'), getAllUsers);

export default router;
