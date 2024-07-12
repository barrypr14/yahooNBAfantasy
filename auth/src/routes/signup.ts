import jwt  from 'jsonwebtoken';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/users.model';
import { BadRequestError, validateRequest } from '@porufantasy/yahoofantasy';

const router = express.Router();

router.post("/api/users/signup", [
    body('email').notEmpty().isEmail().withMessage("Email must be valid"),
    body('password').trim().isLength({min: 6, max: 20}).withMessage("Password must be between 4 and 20 characters"),
    body('client_id').notEmpty().withMessage("Client_id must not be empty"),
    body('client_key').notEmpty().withMessage("Client_key must not be empty")
], validateRequest, async (req: Request, res: Response) => {
    const { email, password, client_id, client_key } = req.body;

    const existingUser = await User.findOne({ email: email });
    if(existingUser){
        throw new BadRequestError("The email is used!!");
    }

    const access_token = "test";
    const refresh_token = "test";
    const user = User.build({ email, password, client_id, client_key, accessToken: access_token, refreshToken: refresh_token});
    await user.save();

    // Encode with JsonWebToken
    const userJWT = jwt.sign({
        id: user.id,
        email: user.email,
        access_token: access_token,
        refresh_token: refresh_token
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJWT
    };

    res.send(user);
})

export { router as signUpRouter};