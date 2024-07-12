import axios, { all } from 'axios';
import util from 'util';
import { parseString } from 'xml2js'
import qs from 'qs';

import { BadRequestError } from '../errors/bad-request-error';
import { Stats } from '../dataTypes/stats';
import { NotAuthorizationError } from '../errors/not-authorization-error';

// Because the data fetched from yahoo Fantasy API is xml format, I need to convert it to json for easy use
const parseStringPromise = util.promisify(parseString);
async function toJson(xml: string): Promise<any>{
    try {
        const result = await parseStringPromise(xml);
        return result;
    } catch (error) {
        console.error("Error parseing XML: ", error);
        throw error;
    }              
}

const errorStatusHandling = (error: unknown) => {
    if(error instanceof Error){
        const statusCode = error.message.split(' ').pop();

        if(statusCode === "401")
            throw new NotAuthorizationError();
        else if(statusCode === "400")
            throw new BadRequestError("Please input correct url");
        console.error(error);
    } else {
        console.error(error);
    }
}


export class FantasyService {
    private static baseUrl: string = "https://fantasysports.yahooapis.com/fantasy/v2/";

    private static makeApiRequest = async (endpoint: string, access_token: string) => {

        const maxAttempts = 2;
        
        for(let attempt = 1; attempt < maxAttempts; attempt++)
        try{
            console.log("Start fetching data......");
            const response = await axios({
                url: this.baseUrl + endpoint,
                method: 'get',
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            if(!response)
                throw new BadRequestError("Can't fetch data from yahoo");
            
            return toJson(response.data);
        } catch (error) {
            throw error;
        }
    }

    // Get all the scoreboard of the manager in the league for League Service
    static getManagerWeekScoreboard = async(access_token: string, league_prefix: string, league_id: string, week: string) => {
        try{
            const response = await this.makeApiRequest(`league/${league_prefix}.l.${league_id}/scoreboard;type=week;week=${week}`, access_token);

            if(!response)
                return {};

            const scoreboardData = response.fantasy_content.league[0].scoreboard[0].matchups[0].matchup;
            const statsData : {[manager: string] : Stats} = {};
 
            scoreboardData.forEach((data: { teams: { team: any; }[]; team_id: (string | number)[]; team_stats: { stats: { stat: { value: any[]; }[]; }[]; }[]; }) => {
                const teams = data.teams[0].team;

                for(const team of teams){
                    statsData[team.team_id[0]] = {
                        FGM: Number(team.team_stats[0].stats[0].stat[0].value[0].split('/')[0]),
                        FGA: Number(team.team_stats[0].stats[0].stat[0].value[0].split('/')[1]),
                        FG: Number(team.team_stats[0].stats[0].stat[1].value[0]),
                        FTM: Number(team.team_stats[0].stats[0].stat[2].value[0].split('/')[0]),
                        FTA: Number(team.team_stats[0].stats[0].stat[2].value[0].split('/')[1]),
                        FT: Number(team.team_stats[0].stats[0].stat[3].value[0]),
                        ThreePTM: Number(team.team_stats[0].stats[0].stat[4].value[0]),
                        PTS: Number(team.team_stats[0].stats[0].stat[5].value[0]),
                        REB: Number(team.team_stats[0].stats[0].stat[6].value[0]),
                        AST: Number(team.team_stats[0].stats[0].stat[7].value[0]),
                        STL: Number(team.team_stats[0].stats[0].stat[8].value[0]),
                        BLK: Number(team.team_stats[0].stats[0].stat[9].value[0]),
                        TO: Number(team.team_stats[0].stats[0].stat[10].value[0]),
                    };                           
                }
            });


            return statsData;
        } catch (error) {
            console.error(error);
        }
    }

    // Get all the win-loss-tie score of each manager in the league for League Service
    static getManagerWeekScoreResult = async(access_token: string, league_prefix: string, league_id: string, week: string) : Promise<{ [manager: string]: { win: number; loss: number; tie: number; opp: string; }} | undefined>=> {
        try{
            const response = await this.makeApiRequest(`league/${league_prefix}.l.${league_id}/scoreboard;type=week;week=${week}`, access_token);

            if(!response)
                return {};

            const scoreboardData = response.fantasy_content.league[0].scoreboard[0].matchups[0].matchup;
            const oppData : {[manager: string] : {win: number, loss: number, tie: number, opp: string}} = {};

            scoreboardData.forEach((data: { teams: { team: any[]; }[]; }) => {
                const team1 = data.teams[0].team[0];
                const team2 = data.teams[0].team[1];

                oppData[team1.team_id[0]] = {
                    win: Number(team1.team_points[0].total[0]),
                    loss: Number(team2.team_points[0].total[0]),
                    tie: 9 - Number(team1.team_points[0].total[0]) - Number(team2.team_points[0].total[0],),
                    opp: team2.team_id[0]
                };
                oppData[team2.team_id[0]] = {
                    win: Number(team2.team_points[0].total[0]),
                    loss: Number(team1.team_points[0].total[0]),
                    tie: 9 - Number(team1.team_points[0].total[0]) - Number(team2.team_points[0].total[0],),
                    opp: team1.team_id[0]
                };
            });
            return oppData;
        } catch (error){
            console.error(error);
        }
    }

    // Get all the meta in the league, currently only have team name for Team service or League Service
    static getLeagueMeta = async(access_token: string, league_prefix: string, league_id: string) => {
        try{
            const response = await this.makeApiRequest(`league/${league_prefix}.l.${league_id}/teams`, access_token);
            const league_name = response.fantasy_content.league[0].name[0];
            
            const league_meta : { league_name: string, teams_name: {[id: string]: string}, league_week: number} = {
                league_name: league_name,
                teams_name: {},
                league_week: response.fantasy_content.league[0].current_week[0]
            };

            for(const team of response.fantasy_content.league[0].teams[0].team){
                league_meta.teams_name[team.team_id[0]] = team.name[0];
            }

            return league_meta;
        } catch(error){
            console.error(error);
        }
    }

    // Get all the player id in specific team for Team Service
    static getTeamRoster = async(access_token: string, league_prefix: string, league_id: string, team_id: string) => {
        try{
            const response = await this.makeApiRequest(`team/${league_prefix}.l.${league_id}.t.${team_id}/roster/players`, access_token);
            
            const rosterData = response.fantasy_content.team[0].roster[0].players[0].player;
            const rosterList = [];

            for(const data of rosterData){
                rosterList.push(data.player_id[0]);
            }

            return rosterList ;
        } catch (error){
            console.error(error);
        }
    }

    // Get all the player stats which are in the specific team for Team Service
    static getTeamRosterStats = async(access_token: string, league_prefix: string, league_id: string, team_id: string) => {
        try{
            const roster = await this.getTeamRoster(access_token, league_prefix, league_id, team_id);
            let url = `league/${league_prefix}.l.${league_id}/players;`;

            if(!roster)
                return {};

            for(const id of roster){
                url += `player_keys=${league_prefix}.p.${id};`
            }
            
            url += '/stats';
            const response = await this.makeApiRequest(url, access_token);
            const playerStatData = response.fantasy_content.league[0].players[0].player;

            const rosterStats : {[player_id: string] : { name: string, stat : Stats}} = {};

            for(const data of playerStatData){
                rosterStats[data.player_id[0]] = {
                    name: data.name[0].full[0],
                    stat: {
                        FGM: Number(data.player_stats[0].stats[0].stat[0].value[0].split('/')[0]),
                        FGA: Number(data.player_stats[0].stats[0].stat[0].value[0].split('/')[1]),
                        FG: Number(data.player_stats[0].stats[0].stat[1].value[0]),
                        FTM: Number(data.player_stats[0].stats[0].stat[2].value[0].split('/')[0]),
                        FTA: Number(data.player_stats[0].stats[0].stat[2].value[0].split('/')[1]),
                        FT: Number(data.player_stats[0].stats[0].stat[3].value[0]),
                        ThreePTM: Number(data.player_stats[0].stats[0].stat[4].value[0]),
                        PTS: Number(data.player_stats[0].stats[0].stat[5].value[0]),
                        REB: Number(data.player_stats[0].stats[0].stat[6].value[0]),
                        AST: Number(data.player_stats[0].stats[0].stat[7].value[0]),
                        STL: Number(data.player_stats[0].stats[0].stat[8].value[0]),
                        BLK: Number(data.player_stats[0].stats[0].stat[9].value[0]),
                        TO: Number(data.player_stats[0].stats[0].stat[10].value[0]),
                    }
                }
            }
            return playerStatData;
        } catch (error){

        }
    }

    // Get a player stats for Player Service
    static getPlayerStats = async(access_token: string, league_prefix: string, league_id: string, player_id: string, type: string = "") => {
        try{
            const response = await this.makeApiRequest(`league/${league_prefix}.l.${league_id}/players;player_keys=${league_prefix}.p.${player_id}/stats;week=${type}`, access_token);
            
            const player_stat : Stats = {
                FGA: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[0].value[0].split('/')[0]),
                FGM: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[0].value[0].split('/')[1]),
                FG: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[1].value[0]),
                FTA: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[2].value[0].split('/')[0]),
                FTM: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[2].value[0].split('/')[0]),
                FT: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[3].value[0]),
                ThreePTM: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[4].value[0]),
                PTS: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[5].value[0]),
                REB: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[6].value[0]),
                AST: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[7].value[0]),
                STL: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[8].value[0]),
                BLK: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[9].value[0]),
                TO: Number(response.fantasy_content.league[0].players[0].player[0].player_stats[0].stats[0].stat[10].value[0]),
            }

            return player_stat;
        } catch(error){
            console.error(error);
        }
    }

    // Get all players stats for Player Service
    static updateAllPlayerStats = async(access_token: string, league_prefix: string, league_id: string, type: string = "") => {
        const allPlayerStats : {[player_id: string] : { name: string, stat: Stats}} = {};

        try{
            for(let start = 0;; start += 25){
                const response = await this.makeApiRequest(`league/${league_prefix}.l.${league_id}/players;start=${start}/stats;week=${type}`, access_token);
                let count = 0;
                console.log(`start updating ${start} players' stat`);
                for(const data of response.fantasy_content.league[0].players[0].player){
                    count++;

                    allPlayerStats[data.player_id[0]] = {
                        name: data.name[0].full[0],
                        stat: {
                            FGA: Number(data.player_stats[0].stats[0].stat[0].value[0].split('/')[0]) | 0,
                            FGM: Number(data.player_stats[0].stats[0].stat[0].value[0].split('/')[1]) | 0,
                            FG: Number(data.player_stats[0].stats[0].stat[1].value[0])| 0,
                            FTA: Number(data.player_stats[0].stats[0].stat[2].value[0].split('/')[0])| 0,
                            FTM: Number(data.player_stats[0].stats[0].stat[2].value[0].split('/')[1])| 0,
                            FT: Number(data.player_stats[0].stats[0].stat[3].value[0])| 0,
                            ThreePTM: Number(data.player_stats[0].stats[0].stat[4].value[0])| 0,
                            PTS: Number(data.player_stats[0].stats[0].stat[5].value[0])| 0,
                            REB: Number(data.player_stats[0].stats[0].stat[6].value[0])| 0,
                            AST: Number(data.player_stats[0].stats[0].stat[7].value[0])| 0,
                            STL: Number(data.player_stats[0].stats[0].stat[8].value[0])| 0,
                            BLK: Number(data.player_stats[0].stats[0].stat[9].value[0])| 0,
                            TO: Number(data.player_stats[0].stats[0].stat[10].value[0])| 0,
                        }
                    }
                }
                console.log(`Finish updating ${start + count} players' stat`);
                if(count !== 25)
                    break;
            }    
            
            console.log(Object.keys(allPlayerStats).length);
            return allPlayerStats;
        } catch(error){
            errorStatusHandling(error);
        }
    }
}


export class OauthService {
    private static endpoint = "https://api.login.yahoo.com/oauth2/get_token";

    static initialAuthorization = async (code: string, client_id: string, client_key: string) : Promise<{
        access_token: string, refresh_token: string, expires_in: string, token_type: string
    }> => {
        const AUTH_HEADER = Buffer.from(`${client_id}:${client_key}`).toString('base64');
        
        const response = await axios({
            url: this.endpoint,
            method: 'post',
            headers: {
                    Authorization: `Basic ${AUTH_HEADER}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
            }, 
            data: qs.stringify({
                client_id: client_id,
                client_secret: client_key,
                redirect_uri: 'oob',
                code: code,
                grant_type: 'authorization_code'
            })
        });

        if(!response)
            throw new BadRequestError("Can't get the access token");

        return response.data;
    }

    static refreshAuthorization = async (refresh_token: string, client_id: string, client_key: string) => {
        try{
            const AUTH_HEADER = Buffer.from(`${client_id}:${client_key}`).toString('base64');
            const response = await axios({
                url: this.endpoint,
                method: "post",
                headers: {
                    Authorization: `Basic ${AUTH_HEADER}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: {
                    redirect_uri: 'oob',
                    refresh_token: refresh_token,
                    grant_type: 'refresh_token'
                }
            });

            return response.data;
        } catch {

        }
    }
}