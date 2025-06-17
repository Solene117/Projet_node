import { Router } from "express";
import {
  getAllLockers,
  addLocker,
  updateLocker,
  deleteLocker,
} from "../controllers/lockerController";
import { protect, restrictTo } from "../../src/middleware/auth";

const router = Router();
router.use(protect);

router.get("/", getAllLockers);
router.post("/", restrictTo(UserRole.ADMIN), addLocker);
router.put("/:id", restrictTo(UserRole.ADMIN), updateLocker);
router.delete("/:id", restrictTo(UserRole.ADMIN), deleteLocker);

export default router;
