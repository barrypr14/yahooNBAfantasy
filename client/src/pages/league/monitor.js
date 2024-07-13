import { useEffect, useState } from "react"
import useRequest from "../../hooks/use-request";
import buildClient from "../../api/build-client";


const MonitorComponent = ({ user }) => {
    console.log(user);
    return (<div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>);
}

MonitorComponent.getInitialProps = async (context) => {
    const client = buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    
    return { user: data} ;
}

export default MonitorComponent;