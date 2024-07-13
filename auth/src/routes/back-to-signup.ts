import { BadRequestError, NotAuthorizationError, OauthService, currentUser } from '@porufantasy/yahoofantasy';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/users.model';

const router = express.Router();

router.post('/api/users/back-to-signup', currentUser, async (req: Request, res: Response) => {
    const { code } = req.body;
    console.log("Get the code in the /back-to-signup");
    if(!req.currentUser){
        throw new NotAuthorizationError();
    }

    const user = await User.findOne({email: req.currentUser.email});
    if(!user){
        throw new BadRequestError("User is not found??");
    }

    const response = await OauthService.initialAuthorization(code, user.client_id, user.client_key );
    if(!response){
        await user.deleteOne();
        throw new BadRequestError("something wrong in yahoo fantasy api, please try again!!");
    }


    user.accessToken = response.access_token;
    user.refreshToken = response.refresh_token;
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        access_token: user.accessToken,
        refresh_token: user.refreshToken
        },
        process.env.JWT_KEY!
    );
    // Store it on session object
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
});

export { router as backToSignupRouter };