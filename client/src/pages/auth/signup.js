import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [client_id, setClient_id] = useState('');
    const [client_key, setClient_key] = useState('');

    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email, password, client_id, client_key
        },
        onSuccess: () => {
            try{
                const yahooAuthUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${client_id}&redirect_uri=https://fantasy.dev/auth/yahooAuth&response_type=code&language=en-us`;
                window.location.href = yahooAuthUrl;   
                // Router.push('/');            
            } catch {
                Router.push('/auth/signup');
            }
        }
    });

    const onSubmit = async (event) => {
        event.preventDefault();

        await doRequest();
    }

    return (
        <form onSubmit={onSubmit} className='container'>
            <h1>Sign Up</h1>
            <div className="form-group col-6">
                <label>Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
            </div>
            <div className="form-group col-6">
                <label>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
            </div>
            <div className="form-group col-6">
                <label>Client Id</label>
                <input value={client_id} onChange={e => setClient_id(e.target.value)} className="form-control" />
            </div>
            <div className="form-group col-6">
                <label>Client Key</label>
                <input value={client_key} onChange={e => setClient_key(e.target.value)} className="form-control" />
            </div>
            {errors}
            <button className="mt-3 btn btn-primary">Sign Up</button>
        </form>);
};