import express from 'express';
import { currentUserRouter } from './routes/current-user';

const app = express();

app.use(currentUserRouter)

app.listen(3000, () => {
    console.log("The auth service is listening on 3000");
});