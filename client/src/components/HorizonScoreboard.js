export default ({ stats, teamName }) => {
    return (
        <tr>
            <td>{ teamName }</td>
            <td>{ (stats.FGM / stats.FGA).toFixed(3) }</td>
            <td>{ stats.FGM } / { stats.FGA }</td>
            <td>{ (stats.FTM / stats.FTA).toFixed(3)}</td>
            <td>{ stats.FTM } / { stats.FTA }</td>
            <td>{ stats.ThreePTM }</td>
            <td>{ stats.PTS }</td>
            <td>{ stats.REB }</td>
            <td>{ stats.AST }</td>
            <td>{ stats.STL }</td>
            <td>{ stats.BLK }</td>
            <td>{ stats.TO}</td>
        </tr>
    )
}