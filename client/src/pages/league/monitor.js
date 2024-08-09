import buildClient from "../../api/build-client";
import Link from 'next/link';
import PowerRanking from "../../components/PowerRanking";
import Scoreboard from "../../components/Scoreboard";


const MonitorComponent = ({ leagues }) => {
    return (
        <div className="mt-5">
            <div className="row d-flex justify-content-center">
                <button type="button" className="btn btn-danger btn-sm col-2">
                    <Link href="/league/create" className="text-dark">Monitor new league</Link>
                </button>
            </div>     
            <div>
                { leagues ? (
                    Object.keys(leagues).map((league_id) => (
                        <>
                        <div className="row">
                            <div className="col-6 d-flex justify-content-center">
                                <PowerRanking key={ league_id } power_ranking= { leagues[league_id].power_ranking } league_id={league_id}/>
                            </div>
                            <div className="col-6 d-flex justify-content-center">
                                <Scoreboard key={ league_id } scoreboard={ leagues[league_id].scoreboard } league_id={league_id} />
                            </div>
                        </div>
                        </>
                    ))
                ) : (
                    <div>Hello world</div>
                )}
            </div>       
        </div>

    );
}

MonitorComponent.getInitialProps = async (context) => {
    const client = buildClient(context);
    const { data } = await client.get('/api/league/power-ranking');
    
    console.log("In the server: ", data);
    return { leagues: data} ;
}

export default MonitorComponent;