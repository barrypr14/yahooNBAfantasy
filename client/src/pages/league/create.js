import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
    const [league_id, setleagueId ] = useState('');
    const [league_prefix, setleaguePrefix] = useState('');  

    const { doRequest, errors } = useRequest({
        url: '/api/league/create',
        method: 'post',
        body: {
            league_id, league_prefix
        },
        onSuccess: () => {Router.push(`/league/monitor`)}
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log("submit!");
        await doRequest();
    }

    return (
        <form onSubmit={onSubmit} className='container'>
            <h1>Monitor the league</h1>
            <div className="form-group col-6">
                <label>League Prefix</label>
                <select value={league_prefix} onChange={e => setleaguePrefix(e.target.value)} className="form-select">
                    <option selected>Please select your league</option>
                    <option value="428">2023-2024 NBA</option>
                </select>
            </div>
            <div className="form-group col-6">
                <label>League Id</label>
                <input value={league_id} onChange={e => setleagueId(e.target.value)} className="form-control" />
            </div>
            {errors}
            <button className="mt-3 btn btn-primary">Monitor</button>
        </form>);
};