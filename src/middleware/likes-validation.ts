import {body} from "express-validator";
import {InputValidationResult} from "./inputValidationResult";


class LikesValidator {
    likeStatusValidation() {
        return body('likeStatus')
            .trim()
            .exists().withMessage('Like status is required')
            .isIn(['None', 'Like', 'Dislike']).withMessage('Invalid like status')
    }
}

const likesValidator = new LikesValidator()

export const likeStatusValidation = () => {
    const validation: any = [
        likesValidator.likeStatusValidation()
    ]
    validation.push(InputValidationResult)
    return validation
}