import React from "react";
import SearchResult from "./SearchResult";
import { useState } from "react";
import { Link } from "react-router-dom";

function Search(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('Games');
    let myHeaders = new Headers();
    myHeaders.append("Client-ID", `${process.env.REACT_APP_CLIENT_ID}`);
    myHeaders.append("Authorization", `${process.env.REACT_APP_BEARER_TOKEN}`);
    myHeaders.append("Content-Type", "text/plain");

    let raw = `search \"${searchTerm}\";fields name,first_release_date,cover.url;`;

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const [results, setResults] = useState([]);
    const [userResults, setUserResults] = useState([]);
    const [isPending, setPending] = useState(false);
    const [error, setError] = useState(null);

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var year = a.getFullYear();
        return year;
    }

    const searchGames = () => {
        setError(false);
        setPending(true);
        fetch("https://rocky-hamlet-24680.herokuapp.com/https://api.igdb.com/v4/games", requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.length === 0) {
                throw Error('No games match that name');
            }
            let oldResults = [];
            for(let i = 0; i < data.length; i++) {
                if(data[i]['first_release_date'] != undefined && data[i].cover != undefined) {
                    oldResults.push(data[i]);
                }
            }
            for(let i = 0; i < oldResults.length; i++) {
                oldResults[i].first_release_date = timeConverter(oldResults[i].first_release_date);
                oldResults[i].cover.url = 'https:' + oldResults[i].cover.url;
            }
            setPending(false);
            setUserResults([]);
            setResults(oldResults);
        })
        .catch((err) => {
            setPending(false);
            setError(err.message);
        })
    }

    const searchUsers = () => {
        var params = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": searchTerm
            }
        }
        
        props.docClient.query(params, function(err, data) {
            if(err) {
                console.log('Could not retrieve user');
                setError('Could not retrieve user');
                setPending(false);
            } else if(data.Count === 0) {
                console.log('User does not exist');
                setError('User does not exist');
                setPending(false);
            }
            else {
                console.log(data);
                const newResults = [];
                for(let i = 0; i < data.Count; i++) {
                    newResults.push(data.Items[i]);
                }
                setUserResults(newResults);
                setResults([]);
                // setResults(data.Items[0]);
                setPending(false);
                setError(null);
            }
        })
    }

    const changeSearch = () => {
        if(searchType === 'Games') {
            setSearchType('Users');
        } else {
            setSearchType('Games');
        }
    }

    return (
        <div className="parent_container">
            <div className="child_container">
                <div><h1>GameGate Search</h1></div>
                <div className="searchBarContainer">
                    <div><input className="textbox" type="text" placeholder="Search GameGate..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/></div>
                    <button className="toggleSearch" onClick={changeSearch}>{searchType}</button>
                </div>
                <div><button className="button" type="submit" onClick={searchType === 'Games' ? searchGames : searchUsers}>Search</button></div>
                {isPending && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {results && !isPending && !error &&
                <div className="search-results">
                    {
                        results.map((val) => (
                                <Link to={`/game/${val.id}`} key={val.id}>
                                    <SearchResult img={val.cover.url} name={val.name} year={val.first_release_date} key={val.id} />
                                </Link>
                        ))
                    }
                </div>}
                {userResults && !isPending && !error &&
                <div className="search-results">
                    {
                        userResults.map((val) => (
                                <Link to={`/profile/${val.Username}`} key={val.Username}>
                                    <SearchResult img={val.ProfilePicture} name={val.Username} key={val.Username} />
                                </Link>
                        ))
                    }
                </div>}
            </div>
    </div>
    )
}

export default Search;