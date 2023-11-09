"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentValidation = void 0;
const express_validator_1 = require("express-validator");
const inputValidationResult_1 = require("../inputValidationResult");
const contentValidation = (0, express_validator_1.body)('content')
    .trim()
    .exists().withMessage('Comment is required')
    .notEmpty().withMessage('Comment must not be empty')
    .isString().withMessage('Comment should be string')
    .isLength({ min: 20, max: 300 }).withMessage('Comment length should be between 20 and 300');
const commentValidation = () => {
    const validation = [contentValidation];
    validation.push(inputValidationResult_1.InputValidationResult);
    return validation;
};
exports.commentValidation = commentValidation;
