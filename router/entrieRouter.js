import express from 'express';
import {
  createEntrie,
  getAllEntries,
  updateEntrie,
} from '../controller/entrieController.js';

const router = express.Router({ mergeParams: true });

router.route('/').post(createEntrie).get(getAllEntries);
router.route('/:id').patch(updateEntrie);

export default router;
