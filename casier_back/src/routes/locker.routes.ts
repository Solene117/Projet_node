import { Router } from "express";
import {
  getAllLockers,
  addLocker,
  updateLocker,
  deleteLocker,
  getLockerById,
} from "../controllers/lockerController";
import { protect, restrictTo } from "../../src/middleware/auth";
import { UserRole } from "../models/User";


const router = Router();
router.use(protect);

router.get('/', getAllLockers);
router.get('/:id', getLockerById);
router.post("/", restrictTo(UserRole.ADMIN), addLocker);
router.put("/:id", restrictTo(UserRole.ADMIN), updateLocker);
router.delete("/:id", restrictTo(UserRole.ADMIN), deleteLocker);

export default router;
