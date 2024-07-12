import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/Header';

// The App component is a top-level component that wraps around all pages in the application
// _app.js file is used for customizing the default App component

const AppComponent =  ({ Component, pageProps, currentUser}) => {
    return <div>
        <Header currentUser={currentUser} />
        <Component {...pageProps}></Component>
    </div>
};

AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};
    if(appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    
    return {
        pageProps,
        ...data
    };
};

export default AppComponent;