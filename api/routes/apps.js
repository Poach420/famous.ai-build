import express from 'express';
import { getApps, getApp, createApp, updateApp, deleteApp } from '../controllers/appsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getApps);
router.get('/:id', getApp);
router.post('/', createApp);
router.put('/:id', updateApp);
router.delete('/:id', deleteApp);

export default router;
