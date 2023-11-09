"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidationResult = void 0;
const express_validator_1 = require("express-validator");
const InputValidationResult = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    const incorrectBlogIdError = errors.array().some(err => ['incorrect blog id', 'incorrect blog id format'].includes(err.msg));
    if (incorrectBlogIdError) {
        return res.sendStatus(404);
    }
    const errorsMessages = errors.array({ onlyFirstError: true })
        .map((error) => {
        return {
            message: error.msg,
            field: error.path,
        };
    });
    res.status(400).send({ errorsMessages });
};
exports.InputValidationResult = InputValidationResult;
