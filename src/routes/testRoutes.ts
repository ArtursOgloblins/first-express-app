import express from "express";
import * as testController from '../controllers/testControllers'

const router = express.Router();

router.get('/all-data', testController.deleteAllVideos)

export default router