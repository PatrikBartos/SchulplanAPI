import express from 'express';
import {
  createEntrie,
  getAllEntries,
  updateEntrie,
  deleteEntrie,
  getEntrie,
} from '../controller/entrieController.js';
import { protectedRoute } from '../controller/authController.js';

const router = express.Router({ mergeParams: true });

router.use(protectedRoute);

router.route('/').post(createEntrie).get(getAllEntries);
router.route('/:id').patch(updateEntrie).delete(deleteEntrie).get(getEntrie);

export default router;
