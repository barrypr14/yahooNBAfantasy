import mongoose from "mongoose";
import express, { Request, Response} from "express";
import { body } from "express-validator";

import { BadRequestError, validateRequest } from "@porufantasy/yahoofantasy";
import { User } from "../models/users.model";

const router = express.Router();

router.post('/api/users/signin', [
    body('email').notEmpty().isEmail().withMessage("Email must be valid"),
    body('password').trim().isLength({min: 6, max: 20}).withMessage("Password must be between 4 and 20 characters"),
], validateRequest, async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Determine the signin user is matched to the register user in the db.
    const user = await User.findOne({email: email, password: password});
    if(!user){
        throw new BadRequestError("Please use valid email or password");
    }

    res.send(user);
})

export { router as signinRouter };