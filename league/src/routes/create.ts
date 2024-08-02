import { BadRequestError, FantasyService, NotAuthorizationError, Scoreboard, currentUser } from '@porufantasy/yahoofantasy';
import express, { Request, Response} from 'express';

import { League } from '../models/league.model';
import { publishLeageCreateEvent } from '../utils/rabbitmq';

const router = express.Router();

// In this route, it needs league_name, how many and what teams in this league. 
// In addition, the current scoreboard in each team are also necessary.
// After create the league data, it should send an event to rabbitmq
router.post('/api/league/create', currentUser, async (req: Request, res: Response) => {
    const { league_prefix, league_id } = req.body;
    
    if(!req.currentUser){
        throw new NotAuthorizationError();
    }

    // If the league is registered from other player in the same league, just append user's email in it.
    const existingleague = await League.findOne({league_id: league_id, league_prefix: league_prefix});
    if(existingleague){
        existingleague.user_email.push(req.currentUser.email);
        res.send(existingleague);
    }

    const access_token = req.currentUser.access_token;
    const league_meta = await FantasyService.getLeagueMeta(access_token, league_prefix, league_id);
    if(!league_meta){
        throw new BadRequestError("Something wrong in fetching league meta");
    }

    const current_week = String(league_meta.league_week);
    const manager_week_scoreboard = await FantasyService.getManagerWeekScoreboard(access_token, league_prefix, league_id, current_week);
    if(!manager_week_scoreboard){
        throw new BadRequestError("Something wwrong in fetching league team scoreboard");
    }

    const manager_week_score = await FantasyService.getManagerWeekScoreResult(access_token, league_prefix, league_id, current_week);
    if(!manager_week_score){
        throw new BadRequestError("Something wwrong in fetching league team score");
    }

    const leauge_team_scoreboard : {[team_id: string] : Scoreboard} = {};
    Object.keys(manager_week_score).forEach((team_id) => {
        leauge_team_scoreboard[team_id] = {
            stats : manager_week_scoreboard[team_id],
            win: manager_week_score[team_id].win,
            loss: manager_week_score[team_id].loss,
            tie: manager_week_score[team_id].tie,
            Opp: manager_week_score[team_id].opp
        }
    })
    const league = League.build({
        user_email: [req.currentUser.email],
        league_name: league_meta.league_name,
        league_id: league_id,
        league_prefix: league_prefix,
        current_scoreboard: leauge_team_scoreboard,
        league_week: current_week,
        teamName_ref: league_meta.teams_name,
        last_updated: Date.now()
    })

    await league.save();

    await publishLeageCreateEvent("league_create", {access_token: access_token, league_prefix: league_prefix, league_id: [league_id]}); // tell the team service to update league_id league data
    res.send(league);
})

export { router as LeagueCreateRouter };