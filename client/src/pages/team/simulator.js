// pages/details/[key].js
import buildClient from '../../api/build-client';
import HorizonScoreboard from '../../components/HorizonScoreboard';

const TeamComponent = ({ scoreboard, team_name, error }) => {
    console.log(scoreboard);
    return (
        <div>
            <table className="table">
                <thead className='thead-dark'>
                    <tr>
                        <th>Team Name</th>
                        <th>FGM / FGA</th>
                        <th>FG%</th>
                        <th>FTM / FTA</th>
                        <th>FT%</th>
                        <th>3PTM</th>
                        <th>PTS</th>
                        <th>REB</th>
                        <th>AST</th>
                        <th>ST</th>
                        <th>BLK</th>
                        <th>TO</th>
                    </tr>
                </thead>
                <tbody>
                    <HorizonScoreboard stats={scoreboard['team'].stats} teamName={team_name}></HorizonScoreboard>
                    <HorizonScoreboard stats={scoreboard['opp'].stats} teamName={team_name}></HorizonScoreboard>
                </tbody>
            </table>
            {error}
        </div>
    );
};

TeamComponent.getInitialProps = async (context) => {
    const { league_id, team_id, team_name } = context.query;

    const client = buildClient(context);
    try{
        const { data } = await client.get(`/api/team/predict-scoreboard?league_prefix=428&league_id=${league_id}&team_id=${team_id}`); // league_prefix should be advised
        console.log(data);
        return { scoreboard: data, team_name: team_name };
    } catch (error) {
        return error;
    }
}
export default TeamComponent;
