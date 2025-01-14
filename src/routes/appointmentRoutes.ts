import { Router } from 'express';
import { bookAppointment, cancelAppointment } from '../controllers/appointmentController';
import verifyToken from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';

const router = Router();

router.post('/', verifyToken, bookAppointment);
router.delete('/:appointmentId', verifyToken,authorizeRoles('customer'), cancelAppointment);

export default router; 