import React from "react";
import SearchResult from "./SearchResult";
import { useState } from "react";
import { Link } from "react-router-dom";

function Search() {
    let searchTerm = '';
    let myHeaders = new Headers();
    myHeaders.append("Client-ID", `${process.env.REACT_APP_CLIENT_ID}`);
    myHeaders.append("Authorization", `${process.env.REACT_APP_BEARER_TOKEN}`);
    myHeaders.append("Content-Type", "text/plain");

    let raw = `search \"${searchTerm}\";fields name,first_release_date,genres.name,cover.url,platforms.name,summary;`;

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    const [results, setResults] = useState([]);

    function newSearchTerm(newTerm) {
        searchTerm = newTerm;
        raw = `search \"${searchTerm}\";fields name,first_release_date,genres.name,cover.url,platforms.name,summary;`
        requestOptions.body = raw;
    }

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var year = a.getFullYear();
        return year;
    }

    const searchGames = () => {
        fetch("https://rocky-hamlet-24680.herokuapp.com/https://api.igdb.com/v4/games", requestOptions)
        .then(response => response.json())
        .then(data => {
            let oldResults = [];
            for(let i = 0; i < data.length; i++) {
                if(data[i]['first_release_date'] != undefined) {
                    oldResults.push(data[i]);
                }
            }
            for(let i = 0; i < oldResults.length; i++) {
                oldResults[i].first_release_date = timeConverter(oldResults[i].first_release_date);
                oldResults[i].cover.url = 'https:' + oldResults[i].cover.url;
            }
            setResults(oldResults);
        })
    }

    return (
        <div className="parent_container">
            <div className="child_container">
                <div><h1>GameGate Search</h1></div>
                <div><input className="textbox" type="text" placeholder="Search GameGate..." onChange={e => newSearchTerm(e.target.value)}/></div>
                <div><button className="button" type="submit" onClick={searchGames}>Search</button></div>
                <div className="search-results">
                    {
                        results.map((val) => (
                                <Link to={`/game/${val.id}`} key={val.id}>
                                    <SearchResult img={val.cover.url} name={val.name} year={val.first_release_date} key={val.id} />
                                </Link>
                        ))
                    }
                </div>
            </div>
    </div>
    )
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return year;
  }

export default Search;