import React from "react";
import SearchResult from "./SearchResult";
import { useState } from "react";
import { Link } from "react-router-dom";

function Search(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('Games');

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

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        }
        fetch(`https://gamegate.herokuapp.com/api/games/?searchTerm=${searchTerm}`, requestOptions)
        .then(response => {
            if(!response.ok) {
                throw Error('Could not get info for that game');
            }
            return response.json();
        })
        .then(results => {
            if(results.length === 0) {
                throw Error('No games match that name');
            }
            let oldResults = [];
            for(let i = 0; i < results.length; i++) {
                if(results[i]['first_release_date'] != undefined && results[i].cover != undefined) {
                    oldResults.push(results[i]);
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
        .catch(err => {
            setPending(false);
            setError(err.message);
        })
    }

    const searchUsers = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        }
        fetch(`https://gamegate.herokuapp.com/api/users/?Username=${searchTerm}`, requestOptions)
        .then(response => {
            if(!response.ok) {
                throw Error('Could not get info for that user');
            }
            return response.json();
        })
        .then(results => {
            if(results.Count === 0) {
                setError('User does not exist');
                setPending(false);
            } else {
                const newResults = [];
                for(let i = 0; i < results.Count; i++) {
                    newResults.push(results.Items[i]);
                    setUserResults(newResults);
                    setResults([]);
                    setPending(false);
                    setError(null);
                }
            }
        })
        .catch(err => {
            setError('Could not retrieve user');
            setPending(false);
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