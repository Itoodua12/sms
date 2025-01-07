import { Router } from 'express';
import { getAllServices, createService } from '../controllers/serviceController';
import verifyToken from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';

const router = Router();

router.get('/', verifyToken, getAllServices);
router.post('/salon/:salonId', verifyToken, authorizeRoles("manager"), createService);

export default router; 