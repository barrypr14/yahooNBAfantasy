import express, { Request, Response} from 'express';

const router = express.Router();

router.get('/api/league/scoreboard', async (req: Request, res: Response) => {
    res.send({"hello": "hardwork"});
});