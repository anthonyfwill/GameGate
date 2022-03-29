import NavBar from './components/NavBar'
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Search from './components/Search';
import Login from './components/Login';
import GameDetails from './components/GameDetails';
import Home from './components/Home'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Profile from './components/Profile';
import { useState } from 'react';
import * as AWS from 'aws-sdk';

var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:'us-east-1:1f1634e0-e85f-4ffe-a509-ecb75c777309'});
var myConfig = new AWS.Config({
  credentials: myCredentials, region: 'us-east-1'
});

AWS.config.update(myConfig)

const docClient = new AWS.DynamoDB.DocumentClient()

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [currUser, setCurrUser] = useState(null);

  function logOut() {
    setLoggedIn(false);
    setCurrUser(null);
  }

  return (
    <Router>
      <div>
        <NavBar loggedIn={loggedIn} currUser={currUser} logOut={logOut}/>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/search">
            <Search />
          </Route>
          <Route exact path="/register">
            <Register setLoggedIn={setLoggedIn} setCurrUser={setCurrUser} docClient={docClient}/>
          </Route>
          <Route exact path="/login">
            <Login setLoggedIn={setLoggedIn} setCurrUser={setCurrUser} docClient={docClient}/>
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/profile/:username">
            <Profile />
          </Route>
          <Route exact path="/game/:id">
            <GameDetails loggedIn={loggedIn} docClient={docClient}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
