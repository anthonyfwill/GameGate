import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
    return (
    <header>
        <input type="checkbox" id="checkbox" />
        <div className="fordarklight"></div>
        <div className="container">
        <h1 className="logo"></h1>
        <Link to="/">
          <img src = {"https://i.imgur.com/HhHqFSf.png"} alt="logo" className="logo" height="65" width="62"/>
          </Link>
        <nav>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Signup</Link></li>
            <li><Link to="/search">Search</Link></li>
          </ul>
        </nav>
      </div>
    </header>
    )
}

export default NavBar;