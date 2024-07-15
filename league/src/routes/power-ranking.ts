import { NotAuthorizationError, Scoreboard, currentUser } from '@porufantasy/yahoofantasy';
import express, { Request, Response} from 'express';
import { League } from '../models/league.model';
import { Stats } from '@porufantasy/yahoofantasy/build/dataTypes/stats';

const router = express.Router();

interface Team {
    team_name: string,
    team_id: string,
    win: number,
    loss: number,
    tie: number
}


router.get('/api/league/power-ranking', currentUser, async (req: Request, res: Response) => {
    
    if(!req.currentUser){
        throw new NotAuthorizationError();
    }

    const uesr_email = req.currentUser.email;
    const leagues = await League.find({ league_id: "27006"});
    // const leagues = await League.find({ user_email: email};)

    // All leagues the user registered 
    const ranking : {[league_id: string] : { "scoreboard": Team[], "power_ranking": Team[]}}= {}

    // Add each team score in every league
    leagues.forEach((league) => {
        ranking[league.league_id] = {"scoreboard": [], "power_ranking": []};

        for(const [team_id, scoreboard] of league.current_scoreboard){
            console.log(team_id);
            console.log(league.teamName_ref.get(team_id));
            const score : Team = {
                team_name: league.teamName_ref.get(team_id)!, 
                team_id: team_id,
                win: scoreboard.win,
                loss: scoreboard.loss,
                tie: scoreboard.tie,
            } 
            
            ranking[league.league_id].scoreboard.push(score);        
        }
    })

    // // // Add power ranking in each league
    leagues.forEach((league) => {
        for(const [team_id1, scoreboard_id1] of league.current_scoreboard){
            const team_score : Team = {team_name: "", team_id: "", win: 0, loss: 0, tie: 0};    
            for(const [team_id2, scoreboard_id2] of league.current_scoreboard){
                if(team_id1 !== team_id2){
                    // It is a complex calculation to get the power ranking, I'm not sure it has a better coding style in my design
                    const stat = Object.keys(scoreboard_id1.stats);

                    stat.forEach((index: string) => {
                        if(index === 'TO'){
                            if(scoreboard_id1.stats.TO < scoreboard_id2.stats.TO)
                                team_score.win += 1;
                            else if(scoreboard_id1.stats.TO > scoreboard_id2.stats.TO)
                                team_score.loss += 1;
                            else
                                team_score.tie += 1;                            
                        } else if(index === 'FGM' || index === 'FGA' || index === 'FTM' || index === 'FTA'){}
                        else{
                            if(scoreboard_id1.stats[index as keyof Stats] > scoreboard_id2.stats[index as keyof Stats])
                                team_score.win += 1;
                            else if(scoreboard_id1.stats[index as keyof Stats] < scoreboard_id2.stats[index as keyof Stats])
                                team_score.loss += 1;
                            else 
                                team_score.tie += 1;
                        }

                    })
                }
            }
            // Put the final win-loss calculation to a list
            team_score.team_name = league.teamName_ref.get(team_id1)!;
            team_score.team_id = team_id1;
            ranking[league.league_id].power_ranking.push(team_score);
        }

        // sort by win game
        ranking[league.league_id].power_ranking.sort((a, b) => { return b.win - a.win;})
    })

    res.send(ranking);
})

export { router as PowerRankingRouter};