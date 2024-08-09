import { BadRequestError, NotAuthorizationError, currentUser, getTeamThisWeekSchedule } from '@porufantasy/yahoofantasy';
import express, { Request, Response } from 'express';
import { Team } from '../models/team.model';

const router = express.Router();

router.get("/api/team/predict-scoreboard", currentUser, async (req: Request, res: Response) => {
    const { league_prefix, league_id, team_id } = req.query;
    if(!req.currentUser){
        throw new NotAuthorizationError();
    }

    // Fetch the team informatiom
    const team = await Team.findOne({league_prefix: league_prefix, league_id: league_id, team_id: team_id});
    if(!team)
        throw new BadRequestError("Provide wrong league_id, team_id");

    // Fetch the information of oppoenent of this team
    const opp_id = team.predict_scoreboard.Opp;    
    const oppteam = await Team.findOne({league_prefix: league_prefix, league_id: league_id, team_id: opp_id});

    if(!oppteam)
        throw new BadRequestError("Provide wrong league_id, team_id in finding Opponent");

    const simulator_data = {"team" : team.predict_scoreboard, "opp": oppteam.predict_scoreboard};
    res.send(simulator_data);
})

export { router as predictScoreboardRouter };