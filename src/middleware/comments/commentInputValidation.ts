import {body} from "express-validator";
import {InputValidationResult} from "../inputValidationResult";

class CommentsValidator {
    contentValidation() {
        return body('content')
            .trim()
            .exists().withMessage('Comment is required')
            .notEmpty().withMessage('Comment must not be empty')
            .isString().withMessage('Comment should be string')
            .isLength({min: 20, max:300}).withMessage('Comment length should be between 20 and 300')
    }

    commentLikeValidation() {
        return body('likeStatus')
            .trim()
            .exists().withMessage('Like status is required')
            .isIn(['None', 'Like', 'Dislike']).withMessage('Invalid like status')
    }
}

const commentValidator = new CommentsValidator()
export const commentValidation = () => {
    const validation: any = [
        commentValidator.contentValidation()
    ]
    validation.push(InputValidationResult)
    return validation
}