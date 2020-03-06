// import useEffect hook
import React, { Component } from 'react';
import {Provider} from 'react-redux';
import {createStore } from 'redux';
import rootReducer from './reducers';

// import Hub
import Amplify, { Auth, Hub,Storage } from 'aws-amplify';
import API from '@aws-amplify/api'
import PubSub from '@aws-amplify/pubsub';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Home from "./components/Pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProductDetail from "./components/Pages/ProductDetailPage/ProductDetailPage";
import AddItem from "./components/Pages/AddItem/AddItem";
import CheckOutPage from "./components/Pages/CheckOutPage/CheckOutPage";
import Profile from "./components/Pages/Profile/Profile";
import CreateAccount from "./components/Pages/CreateAccount/CreateAccount";
import StaticProduct from "./components/Product/StaticProduct";

export const  store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
import awsconfig from "./aws-exports";
API.configure(awsconfig);
PubSub.configure(awsconfig);
Amplify.configure({
  Auth: {
      identityPoolId: process.env.IDENTITY_POOL_ID,
      region: process.env.REGION,
      userPoolId: process.env.USER_POOL_ID,
      userPoolWebClientId: process.env.USER_POOL_WEBCLIENT_ID,
      mandatorySignIn: true,
      oauth: {
        domain: process.env.DOMAIN,
        scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        redirectSignIn: 'https://master.d2nmsllsuquwvm.amplifyapp.com',
        redirectSignOut: 'https://master.d2nmsllsuquwvm.amplifyapp.com',
        responseType: 'token'
      }
    },
  Storage: {
      AWSS3: {
          bucket: process.env.BUCKET, //REQUIRED -  Amazon S3 bucket
          region: process.env.REGION, //OPTIONAL -  Amazon service region
          identityPoolId: process.env.IDENTITY_POOL_ID
      }
  }
});
Storage.configure({
  bucket: process.env.BUCKET,
  level: 'public',
  region: process.env.REGION,
  identityPoolId: process.env.IDENTITY_POOL_ID
});

async function checkUser() {
  return (await Auth.currentAuthenticatedUser());
}

function signOut() {
  Auth.signOut()
    .then(data => console.log(data))
    .catch(err => console.log(err));
}

class App extends Component {

  constructor() {
    super();
    this.state = {user: null};
    
    Hub.listen('auth', (data) => {
        const { payload } = data;
        this.onAuthEvent(payload);
        console.log('A new auth event has happened: ', data);
      })
  };
  
  onAuthEvent(payload) {
    if (payload.event === 'signIn') {
      console.log('a user has signed in!')
    }
    if (payload.event === 'signOut') {
      console.log('a user has signed out!')
    }
  }

  async componentWillMount() {
      const res = await checkUser();
      Auth.currentSession().catch(err => console.log(err));
      this.setState({user: res});
      const result = await Auth.currentSession();
      AWS.config.region =process.env.REGION;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.IDENTITY_POOL_ID,
        Logins: {
            'cognito-idp.us-east-1.amazonaws.com/us-east-1_buFSrhliB': result.getIdToken().getJwtToken()
        }
      });
      AWS.config.credentials = Auth.essentialCredentials(await Auth.currentCredentials());
  }
  
  render() {    
    if (this.state.user == null) {
      return <Login/>;
    } else { 
      return (
        <Router>
          <div id="routeDiv">
            <Switch>
              <Route path="/">
                <Main />
              </ Route>
            </Switch>
          </div>
        </Router>
      );
    } 
  }
};
  
  function Main() {

    return (
      <Provider store={store}>
            <Router>
            <React.Fragment>
                <Header/>
                <Switch>
                    <Route exact path={'/'} render={() => {
                        return <Redirect to={'/products'}/>
                    }}/>
                    <Route exact path={'/products'} component={Home}/>
                    <Route exact path={'/products/:id'} component={ProductDetail}/>
                    <Route exact path={'/additem'} component={AddItem}/>
                    <Route exact path={'/cart'} component={CheckOutPage}/>
                    <Route exact path={'/profile'} component={Profile}/>
                    <Route exact path={'/stripecreation'} component={CreateAccount}/>
                </Switch>
                <Footer/>
            </React.Fragment>
            </Router>
        </Provider>
    );
  }

  function Login() {

    let baseURL = "https://kennyslist0a68ad13e69142fb89779b2dba58e9dd145823-kennyslist.s3.amazonaws.com/public";

    return (
      <div className="app">

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <div className="container">
            <a className="navbar-brand">KennysList</a>
            <div>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a style={{cursor: "pointer"}} onClick={() => Auth.federatedSignIn()} className="nav-link" to={"/additem"}><i className="fa fa-plus mr-2" aria-hidden="true" />Register / Sign In</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div style={{paddingTop: 80}}>

          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8">
              <div className="row">
                <StaticProduct img={baseURL + "/macbookpro.jpeg"} name="MacBook Pro 13-inch"/>
                <StaticProduct img={baseURL + "/samsung.jpg"} name="Samsung Galaxy S10"/>
                <StaticProduct img={baseURL + "/nintendoswitch.jpg"} name="Nintendo Switch"/>
              </div>
            </div>
            <div className="col-lg-2"></div>
          </div>

          <div style={{width: "100%", backgroundColor: "#3366ff", marginBottom: 20, textAlign: "center", color: "white", padding: 15}}>
            <h3>Great products at great prices!</h3>
          </div>

          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8">
              <div className="row">
                <StaticProduct img={baseURL + "/vans.jpeg"} name="Vans Old Skool"/>
                <StaticProduct img={baseURL + "/hoodie.jpeg"} name="NASA Hoodie (Unisex)"/>
                <StaticProduct img={baseURL + "/tshirt.jpeg"} name="Men's T-Shirt"/>
              </div>
            </div>
            <div className="col-lg-2"></div>
          </div>

          <div style={{width: "100%", backgroundColor: "#3366ff", marginBottom: 20, textAlign: "center", color: "white", padding: 15}}>
            <h3>Buy and sell items hassle-free!</h3>
          </div>

          <div className="row">
            <div className="col-lg-2"></div>
            <div className="col-lg-8">
              <div className="row">
                <StaticProduct img={baseURL + "/funkopop.jpg"} name="Funko POP! Animation: Avatar"/>
                <StaticProduct img={baseURL + "/hydroflask.jpg"} name="Hydro Flask Wide Mouth Water Bottle"/>
                <StaticProduct img={baseURL + "/squishmallow.jpg"} name="Sawyer Squishmallow"/>
              </div>
            </div>
            <div className="col-lg-2"></div>
          </div>

        </div>

        <Footer/>
      </div>
    );
  }

export default App;


