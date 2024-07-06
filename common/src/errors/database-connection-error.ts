import { CustomError } from "./custom-error";
// It is easy to realize what this error means. 
// It represents when the service can't connect to the db
export class DatabaseConnectionError extends CustomError {
    reason = "Error connect to the database";
    statusCode = 500;

    constructor(){
        super("Error connect to the database");

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [{message: this.reason}];
    }
}