import express from "express";
import {createUserValidation} from "../middleware/users/createUserValidation";
import {basicAuth} from "../middleware/auth/basicAuth";
import {container} from "../composition-root";
import {UserController} from "../controllers/user-controller";

const userController = container.resolve(UserController)

const usersRouter =  express.Router();

usersRouter.get('/', basicAuth, userController.getAllUsers.bind(userController))
usersRouter.post('/', basicAuth, createUserValidation(), userController.addUser.bind(userController))
usersRouter.delete('/:id', basicAuth, userController.deleteUserById.bind(userController))

export default usersRouter