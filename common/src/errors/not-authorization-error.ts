import { CustomError } from "./custom-error";

export class NotAuthorizationError extends CustomError {
    statusCode = 401;

    constructor(){
        super("Not Authorized");

        Object.setPrototypeOf(this, NotAuthorizationError.prototype);
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{message: "Not Authorized"}];
    }
}