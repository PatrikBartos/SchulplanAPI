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

router
  .route('/')
  .post(protectedRoute, createEntrie)
  .get(protectedRoute, getAllEntries);
router
  .route('/:id')
  .patch(protectedRoute, updateEntrie)
  .delete(protectedRoute, deleteEntrie)
  .get(protectedRoute, getEntrie);

export default router;
