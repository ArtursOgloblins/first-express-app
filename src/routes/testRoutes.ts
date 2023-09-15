import express from "express";
import * as testController from '../controllers/testControllers'

const router = express.Router();

router.delete('/all-data', testController.deleteAllVideos)

export default router