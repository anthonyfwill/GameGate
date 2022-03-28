import NavBar from './components/NavBar'
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Search from './components/Search';
import Login from './components/Login';
import GameDetails from './components/GameDetails';
import Home from './components/Home'
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import Profile from './components/Profile';
import { useState } from 'react';

function App() {

  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);
  const [currUser, setCurrUser] = useState(null);

  function logOut() {
    setLoggedIn(false);
    setCurrUser(null);
    // history.push('/login');
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
            <Register setLoggedIn={setLoggedIn} setCurrUser={setCurrUser}/>
          </Route>
          <Route exact path="/login">
            <Login  setLoggedIn={setLoggedIn} setCurrUser={setCurrUser}/>
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/profile/:username">
            <Profile />
          </Route>
          <Route exact path="/game/:id">
            <GameDetails />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
