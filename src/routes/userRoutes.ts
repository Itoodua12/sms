import { Request, Response } from 'express';
import { Router } from 'express';
import verifyToken from '../middleware/authMiddleware';
import authorizeRoles from '../middleware/roleMiddleware';
const router = Router();


router.get("/manager", verifyToken, authorizeRoles("manager"), (req: Request, res: Response) => {
    res.json({message: "manager"})
})

router.get("/customer", verifyToken, authorizeRoles("customer"), (req: Request, res: Response) => {
    res.json({message: "customer"})
})

export default router;