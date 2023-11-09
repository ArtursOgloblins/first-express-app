"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserValidation = void 0;
const express_validator_1 = require("express-validator");
const inputValidationResult_1 = require("../inputValidationResult");
const loginValidation = (0, express_validator_1.body)('login')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Username should be string')
    .isLength({ max: 10, min: 3 }).withMessage('Length must be between 3-10 chars')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Invalid format');
const passwordValidation = (0, express_validator_1.body)('password')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Password must be string')
    .isLength({ max: 20, min: 6 }).withMessage('Length must be between 6-20 chars');
const emailValidation = (0, express_validator_1.body)('email')
    .trim()
    .exists().withMessage('Field is required')
    .notEmpty().withMessage('Field must not be empty')
    .isString().withMessage('Username should be string')
    .matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Invalid email format');
const createUserValidation = () => {
    const validation = [
        loginValidation,
        passwordValidation,
        emailValidation
    ];
    validation.push(inputValidationResult_1.InputValidationResult);
    return validation;
};
exports.createUserValidation = createUserValidation;
