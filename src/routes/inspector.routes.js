import express from 'express';
import { inspectUrl } from '../controllers/inspector.controller';

const router = express.Router();

router.route('/*').get(inspectUrl);

export default router;
