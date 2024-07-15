export default (  { power_ranking } ) => {

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
                            <tr id={team.id}>
                                <td>{team.team_name}</td>
                                <td>{team.win}-{team.loss}-{team.tie}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>                                
    );
    return ranking;
}