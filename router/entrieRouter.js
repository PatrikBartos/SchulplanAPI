import express from 'express';
import { createEntrie, getAllEntries } from '../controller/entrieController.js';

const router = express.Router({ mergeParams: true });

router.route('/').post(createEntrie).get(getAllEntries);

export default router;
