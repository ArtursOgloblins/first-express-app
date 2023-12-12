import express from "express";
import {testController} from "../composition-root";

const testRouter = express.Router();

testRouter.delete('/all-data', testController.deleteAllBeforeTest.bind(testController))

export default testRouter