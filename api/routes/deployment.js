import express from 'express';
import { 
  prepareDeployment, 
  getDeploymentStatus, 
  getDeployments,
  updateDeploymentStatus 
} from '../controllers/deploymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/prepare', prepareDeployment);
router.get('/', getDeployments);
router.get('/:id', getDeploymentStatus);
router.put('/:id', updateDeploymentStatus);

export default router;
