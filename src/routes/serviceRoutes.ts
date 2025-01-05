import { Router } from 'express';
import { getAllServices } from '../controllers/serviceController';
import verifyToken from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, getAllServices);

export default router; 