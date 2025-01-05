import { Router } from 'express';
import { createEmployee } from '../controllers/employeeController';
import verifyToken from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';

const router = Router();

router.post('/salon/:salonId/', verifyToken, authorizeRoles("manager"), createEmployee);

export default router; 