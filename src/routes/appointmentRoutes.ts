import { Router } from 'express';
import { bookAppointment } from '../controllers/appointmentController';
import verifyToken from '../middleware/authMiddleware';

const router = Router();

router.post('/', verifyToken, bookAppointment);

export default router; 