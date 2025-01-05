import { Router } from 'express';
import { createSalon, filterSalons } from '../controllers/salonController';
import verifyToken from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';

const router = Router();

router.post('/', verifyToken, authorizeRoles("manager"), createSalon);
router.get('/filter',verifyToken, authorizeRoles("manager"), filterSalons);

export default router;