import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { LeagueCreateRouter } from './routes/create';
import { PowerRankingRouter } from './routes/power-ranking';
import { NotFoundError, errorHandler } from '@porufantasy/yahoofantasy';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(LeagueCreateRouter);
app.use(PowerRankingRouter);

app.all('*',async ()=>{
    throw new NotFoundError();
})

app.use(errorHandler);
export { app };
