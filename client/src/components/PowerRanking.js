import Link from "next/link";

export default (  { power_ranking, league_id } ) => {

    const ranking = ( 
            <table>
                <thead>
                    <tr>
                        <td>Team name</td>
                        <td>Win-Loss-Tie</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        power_ranking.map((team) => (
                            <tr id={team.team_id}>
                                <td><Link href={`/team/simulator?league_id=${league_id}&team_id=${team.team_id}&team_name=${team.team_name}`}>{team.team_name}</Link></td>
                                <td>{team.win} - {team.loss} - {team.tie}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>                                
    );
    return ranking;
}