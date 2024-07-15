export default ({ scoreboard }) => {
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
                        <tr id={team.id} className="text-center">
                            <td>{team.team_name}</td>
                            <td>{team.win} - {team.loss} - {team.tie}</td>
                        </tr>
                    ))
                }            
            </tbody>
        </table>
    )
}