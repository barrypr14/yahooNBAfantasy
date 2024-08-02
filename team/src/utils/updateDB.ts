import { BadRequestError, FantasyService } from '@porufantasy/yahoofantasy';
import { Team } from '../models/team.model';

const updateDB =  async (access_token: string, league_prefix: string, league_ids: string[]) => {
    const league_id = league_ids[0];
    console.log("In updateDB, ", league_id);
    // Get all team id in specific league
    const league_meta = await FantasyService.getLeagueMeta(access_token, league_prefix, league_id);
    if(!league_meta){
        throw new BadRequestError("Something wrong in route updatedb team service ");
    }

    // Get all team scoreboard stats in specific league
    const week = "22" // String(league_meta.league_week);
    const manager_scoreboard_stats = await FantasyService.getManagerWeekScoreboard(access_token, league_prefix, league_id, week);
    const manager_scoreboard_result = await FantasyService.getManagerWeekScoreResult(access_token, league_prefix, league_id, week);
    if(!manager_scoreboard_stats || !manager_scoreboard_result){
        throw new BadRequestError("Something wrong in route updatedb team service ");
    }

    const teams_id = Object.keys(league_meta.teams_name);
    for(const team_id of teams_id){
        console.log(`In team Service, ${team_id} is created`);
        const roster_stat = await FantasyService.getTeamRosterStats(access_token, league_prefix, league_id, team_id);
        const team_stat = manager_scoreboard_stats[team_id];
        const team_result = manager_scoreboard_result[team_id];
        if(!roster_stat || !team_stat || !team_result)
            throw new BadRequestError("Something wrong in the result of fantasy service");


        const team = Team.build({
            league_id: league_id,
            league_prefix: league_prefix,
            team_id: team_id,
            team_name: league_meta.teams_name[team_id],
            roster: roster_stat,
            predict_scoreboard: {stats: team_stat, win: team_result.win, loss: team_result.loss, tie: team_result.tie, Opp: team_result.opp},
            initial_predict_scoreboard: {stats: team_stat, win: team_result.win, loss: team_result.loss, tie: team_result.tie, Opp: team_result.opp},
            league_week: Number(week),
            last_updated: new Date(),
        });
        console.log(team);
        await team.save();
    }
}

export { updateDB }