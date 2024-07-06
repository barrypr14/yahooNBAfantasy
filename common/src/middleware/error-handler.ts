import { CustomError } from "../errors/custom-error";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof CustomError){
        return res.status(err.statusCode).send({error: err.serializeErrors()});
    }

    console.error(err);

    res.status(400).send({
        errors: [{message: 'Something went wrong'}]
    });
};