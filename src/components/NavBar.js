import React from "react";
import { Link } from "react-router-dom";

function NavBar(props) {
    return (
    <header>
        <input type="checkbox" id="checkbox" />
        <div className="fordarklight"></div>
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
            {props.loggedIn &&<li><Link to={`/profile/${props.currUser}`}>Profile</Link></li>}
            <li><Link to="/search">Search</Link></li>
            {props.loggedIn && <li className='log-out' onClick={props.logOut}>Log Out</li>}
          </ul>
        </nav>
      </div>
    </header>
    )
}

export default NavBar;