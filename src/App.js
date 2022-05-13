import NavBar from './components/NavBar'
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Search from './components/Search';
import Login from './components/Login';
import GameDetails from './components/GameDetails';
import Home from './components/Home'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Profile from './components/Profile';
import { useEffect, useState } from 'react';
import * as AWS from 'aws-sdk';
import Settings from './components/Settings';
import FollowList from './components/FollowList';
import GameStatusMap from './components/GameStatusMap'


var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:'us-east-1:1f1634e0-e85f-4ffe-a509-ecb75c777309'});
var myConfig = new AWS.Config({
  credentials: myCredentials, region: 'us-east-1'
});

AWS.config.update(myConfig)

const docClient = new AWS.DynamoDB.DocumentClient()

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [currUser, setCurrUser] = useState(null);
  const [userRetrieval, setUserRetrieval] = useState(false);
  const [currUserInfo, setCurrUserInfo] = useState(null);
  const [completion, setCompletion] = useState(false);
  const [idToken, setIdToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);


  useEffect(() => {
    if(!userRetrieval) {
      const user = localStorage.getItem("user");
      const idToken = localStorage.getItem('idToken');
      const refreshToken = localStorage.getItem('refreshToken');
      async function getLoginInfo() {
        if(user) {
          setUserRetrieval(true);
          let jsoned = await JSON.parse(user);
          setCurrUserInfo(jsoned);
          let parsed = await jsoned.Username;
          setCurrUser(parsed);
          setIdToken(idToken);
          setRefreshToken(refreshToken);
          setLoggedIn(true);
        }
      }
      getLoginInfo();
    } else {
      setCompletion(true);
    }
  }, [currUserInfo])

  function logOut() {
    setIdToken(null);
    setRefreshToken(null);
    setLoggedIn(false);
    setCurrUser(null);
    localStorage.clear();
  }

  return (
    <Router>
      <div>
        <NavBar loggedIn={loggedIn} currUser={currUser} logOut={logOut} currUserInfo={currUserInfo}/>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/search">
            <Search />
          </Route>
          <Route exact path="/register">
            <Register setLoggedIn={setLoggedIn} setCurrUser={setCurrUser} docClient={docClient} setCurrUserInfo={setCurrUserInfo}/>
          </Route>
          <Route exact path="/login">
            <Login setRefreshToken={setRefreshToken} setIdToken={setIdToken} setLoggedIn={setLoggedIn} setCurrUser={setCurrUser} docClient={docClient} setCurrUserInfo={setCurrUserInfo}/>
          </Route>
          <Route exact path="/home">
            <Home currUser={currUser} setCurrUser={setCurrUser} docClient={docClient} setCurrUserInfo={setCurrUserInfo} currUserInfo={currUserInfo}/>
          </Route>
          <Route exact path="/profile/:username">
            <Profile completion={completion} loggedIn={loggedIn} currUser={currUser} setCurrUserInfo={setCurrUserInfo} currUserInfo={currUserInfo}/>
          </Route>
          <Route exact path="/settings">
            <Settings currUser={currUser} setCurrUser={setCurrUser} docClient={docClient} setCurrUserInfo={setCurrUserInfo} currUserInfo={currUserInfo}/>
          </Route>
          <Route exact path="/game/:id">
            <GameDetails completion={completion} setCurrUserInfo={setCurrUserInfo} loggedIn={loggedIn} docClient={docClient} currUser={currUser} currUserInfo={currUserInfo}/>
          </Route>
          <Route exact path="/following/:username">
            <FollowList type={'following'} docClient={docClient}/>
          </Route>
          <Route exact path="/followers/:username">
            <FollowList type={'follower'} docClient={docClient}/>
          </Route>
          <Route exact path="/planning/:username">
            <GameStatusMap type={'planning'} docClient={docClient}/>
          </Route>
          <Route exact path="/currentG/:username">
            <GameStatusMap type={'currentG'} docClient={docClient}/>
          </Route>
          <Route exact path="/completed/:username">
            <GameStatusMap type={'completed'} docClient={docClient}/>
          </Route>
          <Route exact path="/dropped/:username">
            <GameStatusMap type={'dropped'} docClient={docClient}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;