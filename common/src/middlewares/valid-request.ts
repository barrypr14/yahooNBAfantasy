import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from "express";

import { RequestValidationError } from "../errors/request-validation-error";

// The middleware handles the sigin / signup errors, received the error from express-validator and pass through ReqeustValidationError()
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }

    next();
}