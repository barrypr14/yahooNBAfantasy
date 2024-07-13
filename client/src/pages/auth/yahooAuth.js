import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';

import useRequest from '../../hooks/use-request';

export default () => {
    const router = useRouter();

    const { doRequest, errors } = useRequest({
        url: '/api/users/back-to-signup',
        method: 'post',
        onSuccess: () => Router.push('/league/monitor')
    });

    useEffect(() => {
        const completeSignup = async () => {
            // Extract the authorization code from the URL
            const { code } = router.query;
            console.log("in the browser can see the code is", code);
            if(code){
                await doRequest({code: code});
            }
        }
        completeSignup();
        // Send a request to the server to complete the signup process
        // Include the extracted code and state in the request body
        // Handle the response as needed (e.g., show a success message)
    }, [router.query]);
    return <div>Completing signup...{errors}</div>;
};