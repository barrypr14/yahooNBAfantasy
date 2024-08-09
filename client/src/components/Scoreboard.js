import Link from "next/link"

export default ({ scoreboard, league_id }) => {
    return (
        <table>
            <thead>
                <tr>
                    <td>Team name</td>
                    <td>Win-Loss-Tie</td>
                </tr>                
            </thead>
            <tbody>
                {
                    scoreboard.map((team) => (
                        <tr id={team.team_id} className="text-center">
                            <td><Link href={`/team/simulator?league_id=${league_id}&team_id=${team.team_id}&team_name=${team.team_name}`}>{team.team_name}</Link></td>
                            <td>{team.win} - {team.loss} - {team.tie}</td>
                        </tr>
                    ))
                }            
            </tbody>
        </table>
    )
}