import express from 'express';
import { generateCode, generateComponent, refactorCode } from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/generate', generateCode);
router.post('/generate-component', generateComponent);
router.post('/refactor', refactorCode);

export default router;
