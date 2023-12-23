import express from "express";
import {container} from "../composition-root";
import {TestController} from "../controllers/test-controller";

const testController = container.resolve(TestController)

const testRouter = express.Router();

testRouter.delete('/all-data', testController.deleteAllBeforeTest.bind(testController))

export default testRouter