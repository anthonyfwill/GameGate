import React from "react";
import { Link, useHistory } from "react-router-dom";

function NavBar(props) {

  const history = useHistory();

  function logout() {
    props.logOut();
    history.push('/login')
  }

  return (
    <header>
        {/* <input type="checkbox" id="checkbox" /> */}
        {/* <div className="fordarklight"></div> */}
        <div className="container">
        <h1 className="logo"></h1>
        <Link to={props.loggedIn ? '/home' : '/'}>
          <img src = {"https://i.imgur.com/HhHqFSf.png"} alt="logo" className="logo" height="65" width="62"/>
          </Link>
        <nav>
          <ul>
            <li><Link to="/home">Home</Link></li>
            {!props.loggedIn && <li><Link to="/login">Login</Link></li>}
            {!props.loggedIn &&<li><Link to="/register">Signup</Link></li>}
            <li><Link to="/search">Search</Link></li>
            {props.loggedIn &&
            <li className="dropdown">
              <img id="navBarpfp" src={props.currUserProfile.ProfilePicture} alt={props.currUser}/>
              <div className="dropdown-content">
                <a><Link to={`/profile/${props.currUser}`}>Profile</Link></a>
                <a><Link to="/settings">Settings</Link></a>
                <a className="log-out" onClick={logout}>Logout</a>
              </div>
            </li>}
          </ul>
        </nav>
      </div>
    </header>
    )
}

export default NavBar;