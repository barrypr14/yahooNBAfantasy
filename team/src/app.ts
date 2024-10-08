import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { NotFoundError, errorHandler } from '@porufantasy/yahoofantasy';
import { predictScoreboardRouter } from './routes/predict_scoreboard';
import { rosterRouter } from './routes/roster';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(predictScoreboardRouter);
app.use(rosterRouter);

app.all('*',async ()=>{
    throw new NotFoundError();
})

app.use(errorHandler);
export { app };