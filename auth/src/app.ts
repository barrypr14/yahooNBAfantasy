import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';

import { currentUserRouter } from './routes/current-user';
import { signUpRouter } from './routes/signup';

import { errorHandler } from '@porufantasy/yahoofantasy';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import cookieSession from 'cookie-session';
import { backToSignupRouter } from './routes/back-to-signup';

const app = express();

app.set('trust proxy', true);
app.use(json());
// When secure is true, meaning it is in the test mode, which can be connected with HTTP
// If the secure is false, only HTTPS can make a connection.
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(backToSignupRouter);

app.use(errorHandler);
export { app };