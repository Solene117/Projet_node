import { Router } from 'express';
import {
  getAllLockers,
  addLocker,
  updateLocker,
  deleteLocker,
} from '../controllers/lockerController';
import { protect } from '../../middleware/auth';

const router = Router();
router.use(protect);

router.get('/', getAllLockers);
router.post('/', addLocker);
router.put('/:id', updateLocker);
router.delete('/:id', deleteLocker);

export default router;
