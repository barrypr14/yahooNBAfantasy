import { BadRequestError, NotAuthorizationError, currentUser } from '@porufantasy/yahoofantasy';
import express, { Request, Response } from 'express';
import { Team } from '../models/team.model';

const router = express.Router();

router.get("/api/team/roster", currentUser, async (req: Request, res: Response) => {
    const { league_prefix, league_id, team_id } = req.query;

    if(!req.currentUser){
        throw new NotAuthorizationError();
    }

    const team = await Team.findOne({league_prefix: league_prefix, league_id: league_id, team_id: team_id});
    if(!team)
        throw new BadRequestError("Provide wrong league_id, team_id");

    res.send(team.roster);
})