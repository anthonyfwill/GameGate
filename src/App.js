import NavBar from './components/NavBar'
import LandingPage from './components/LandingPage';
import Register from './components/Register';
import Search from './components/Search';
import Login from './components/Login';
import GameDetails from './components/GameDetails';
import Home from './components/Home'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/search">
            <Search />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/home">
            <Home />
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
