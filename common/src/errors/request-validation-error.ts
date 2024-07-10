import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";
// This error is normalized the validError of users signin/signup
// Because the validation criteria is using express-validator, it pass an array inside and normalize the error.

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]){
        super("Invalid request parameters");

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            if(err.type == 'field')
                return { message: err.msg, field: err.path};

            return {message: err.msg};
        })
    }

}