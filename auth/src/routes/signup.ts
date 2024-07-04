import express from 'express';
import { body } from 'express-validator';
import { User } from '../models/users.model';

const router = express.Router();

router.post("/api/users/signup", [
    body('email').notEmpty().isEmail().withMessage("Email must be valid"),
    body('password').trim().isLength({min: 6, max: 20}).withMessage("Password must be between 4 and 20 characters"),
    body('client_id').notEmpty().withMessage("Client_id must not be empty"),
    body('client_key').notEmpty().withMessage("Client_key must not be empty")
], async (req: any, res: any) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if(existingUser){
        console.log("error");
    }
})