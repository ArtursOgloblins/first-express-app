import express from "express";
import * as videoController from '../controllers/videocontrollers'
import {deleteAllVideos} from "../controllers/videocontrollers";

const router = express.Router();

router.get('/', videoController.getVideos)
router.get('/:id', videoController.getVideoById)
router.delete('/:id', videoController.deleteVideoById)
router.post('/', videoController.addVideo)
router.put('/:id', videoController.updateVideo)

export default router