import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import Review from "./Review";

const GameDetails = (props) => {
    const { id } = useParams();

    const { results, isPending, error, reviewInfo, setReviewInfo, score, setScore } = useFetch(id, props.docClient);
    const [reviewOpened, setReviewOpened] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewScore, setReviewScore] = useState('');
    const [planning, setPlanning] = useState(false);
    const [currentG, setCurrentG] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [dropped, setDropped] = useState(false);

    useEffect(() => {
        if(props.currUserInfo) {
            if(results != undefined) {
                gameStatusMap(results[0].name);
            }
        }
    }, [props.completion, results]);

    const checkUpvote = async () => {
        if (results != undefined) {
            await gameStatusMap(results[0].name, "CurrentGames")
        }
    }

    const gameStatusMap = async (gameName) => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
          
        fetch(`http://localhost:5000/api/user/${props.currUser}/gamestatuses/?gameName=${gameName}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                let pg = (result.status === "PlanningGames") ? true : false;
                setPlanning(pg);

                let complG = (result.status === "CompletedGames") ? true : false;
                setCompleted(complG);

                let currG = (result.status === "CurrentGames") ? true : false;
                setCurrentG(currG);

                let dg = (result.status === "DroppedGames") ? true : false;
                setDropped(dg);

                if(!pg && !complG && !currG && !dg) {
                    setPlanning(false);
                    setCompleted(false);
                    setCurrentG(false);
                    setDropped(false);
                }
            })
            .catch(error => console.log('error', error));
    }

    function combineAll(array) {
        const output = [];
        for(let i = 0; i < array.length; i++) {
            output.push(array[i].name);
        }
        return output.join(', ');
    }

    function updateReviews(gameName, email, username, reviewText, reviewScore, gameImg, profPic) {
        let reviews = JSON.stringify(reviewInfo);
        setReviewOpened(false);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("id", id);
        urlencoded.append("gameName", gameName);
        urlencoded.append("email", email);
        urlencoded.append("username", username);
        urlencoded.append("reviewText", reviewText);
        urlencoded.append("reviewScore", reviewScore);
        urlencoded.append("gameImg", gameImg);
        urlencoded.append("profPic", profPic);
        urlencoded.append("reviewInfo", reviews);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://localhost:5000/api/reviews", requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.reviewInfo) {
                updateScore(result.reviewInfo);
                setReviewInfo(result.reviewInfo);
                setReviewScore('');
                setReviewText('');
            }
        })
        .catch(error => console.log('error', error));
    }

    function updateScore(moreReviewInfo) {
        let newScore = 0;
        for(let i = 0; i < moreReviewInfo.length; i++) {
            newScore += parseInt(moreReviewInfo[i].Rating);
        }
        newScore = newScore / moreReviewInfo.length;
        newScore = Math.round(newScore * 100) / 100;
        setScore(newScore);
    }

    function planningGames(yourUsername, gameName, gameID, gameImg) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("gameName", gameName);
        urlencoded.append("gameID", gameID);
        urlencoded.append("gameImg", gameImg);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${yourUsername}/planning`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newPlanningInfo) {
                let newInfo = Object.assign({}, props.currUserInfo);
                newInfo.Planning = result.newPlanningInfo.Attributes.Planning;
                newInfo.PlanningGames[gameName] = result.newPlanningInfo.Attributes.PlanningGames[gameName];
                props.setCurrUserInfo(newInfo);
                localStorage.setItem('user', JSON.stringify(newInfo));
                const action = yourUsername + " is planning to play " + gameName;
                var dateTime = new Date();
                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                let idStr = idNum.toString();
                addUserFeed(props.currUserInfo.Email, yourUsername, idStr, gameID, gameName, gameImg, action, dateTimeEST);
            }
        })
        .catch(error => console.log('error', error));
        setPlanning(true);
        removeCompletedGame(yourUsername, gameName);
        removeCurrentGame(yourUsername, gameName);
        removeDroppedGame(yourUsername, gameName);
    }

    function removePlanningGame(yourUsername, gameName, gameID, gameImg, dateTime) { 
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("gameName", gameName);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${yourUsername}/planning/delete`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newPlanningInfo) {
                let newInfo = Object.assign({}, props.currUserInfo);
                newInfo.Planning = result.newPlanningInfo.Attributes.Planning;
                delete newInfo.PlanningGames[gameName];
                props.setCurrUserInfo(newInfo);
                localStorage.setItem('user', JSON.stringify(newInfo));
            }
        })
        .catch(error => error);
        setPlanning(false);
    }

    function completedGames(yourUsername, gameName, gameID, gameImg) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("gameName", gameName);
        urlencoded.append("gameID", gameID);
        urlencoded.append("gameImg", gameImg);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${yourUsername}/completed`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newCompletedInfo) {
                let newInfo = Object.assign({}, props.currUserInfo);
                newInfo.Completed = result.newCompletedInfo.Attributes.Completed;
                newInfo.CompletedGames[gameName] = result.newCompletedInfo.Attributes.CompletedGames[gameName];
                props.setCurrUserInfo(newInfo);
                localStorage.setItem('user', JSON.stringify(newInfo));
                const action = yourUsername + " has completed " + gameName;
                var dateTime = new Date();
                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                let idStr = idNum.toString();
                addUserFeed(props.currUserInfo.Email, yourUsername, idStr, gameID, gameName, gameImg, action, dateTimeEST);
            }
        })
        .catch(error => error);
        setCompleted(true);
        removePlanningGame(yourUsername, gameName);
        removeCurrentGame(yourUsername, gameName);
        removeDroppedGame(yourUsername, gameName);
    }

    function removeCompletedGame(yourUsername, gameName, gameID, gameImg) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("gameName", gameName);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${yourUsername}/completed/delete`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newCompletedInfo) {
                let newInfo = Object.assign({}, props.currUserInfo);
                newInfo.Completed = result.newCompletedInfo.Attributes.Completed;
                delete newInfo.CompletedGames[gameName];
                props.setCurrUserInfo(newInfo);
                localStorage.setItem('user', JSON.stringify(newInfo));
            }
        })
        .catch(error => error);
        setCompleted(false);
    }

    function currentGames(yourUsername, gameName, gameID, gameImg) { 
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("gameName", gameName);
        urlencoded.append("gameID", gameID);
        urlencoded.append("gameImg", gameImg);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${yourUsername}/current`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newCurrentInfo) {
                let newInfo = Object.assign({}, props.currUserInfo);
                newInfo.CurrentG = result.newCurrentInfo.Attributes.CurrentG;
                newInfo.CurrentGames[gameName] = result.newCurrentInfo.Attributes.CurrentGames[gameName];
                props.setCurrUserInfo(newInfo);
                localStorage.setItem('user', JSON.stringify(newInfo));
                const action = yourUsername + " is currently playing " + gameName;
                var dateTime = new Date();
                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                let idStr = idNum.toString();
                addUserFeed(props.currUserInfo.Email, yourUsername, idStr, gameID, gameName, gameImg, action, dateTimeEST);
            }
        })
        .catch(error => error);
        setCurrentG(true)
        removePlanningGame(yourUsername, gameName);
        removeCompletedGame(yourUsername, gameName);
        removeDroppedGame(yourUsername, gameName);
    }

    function removeCurrentGame(yourUsername, gameName, gameID, gameImg) { 
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("gameName", gameName);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${yourUsername}/current/delete`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newCurrentInfo) {
                let newInfo = Object.assign({}, props.currUserInfo);
                newInfo.CurrentG = result.newCurrentInfo.Attributes.CurrentG;
                delete newInfo.CurrentGames[gameName];
                props.setCurrUserInfo(newInfo);
                localStorage.setItem('user', JSON.stringify(newInfo));
            }
        })
        .catch(error => error);
        setCurrentG(false);
    }

    function droppedGames(yourUsername, gameName, gameID, gameImg) { 
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("gameName", gameName);
        urlencoded.append("gameID", gameID);
        urlencoded.append("gameImg", gameImg);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${yourUsername}/dropped`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newDroppedInfo) {
                let newInfo = Object.assign({}, props.currUserInfo);
                newInfo.Dropped = result.newDroppedInfo.Attributes.Dropped;
                newInfo.DroppedGames[gameName] = result.newDroppedInfo.Attributes.DroppedGames[gameName];
                props.setCurrUserInfo(newInfo);
                localStorage.setItem('user', JSON.stringify(newInfo));
                const action = yourUsername + " has dropped " + gameName;
                var dateTime = new Date();
                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                let idStr = idNum.toString();
                addUserFeed(props.currUserInfo.Email, yourUsername, idStr, gameID, gameName, gameImg, action, dateTimeEST);
            }
        })
        .catch(error => error);
        setDropped(true);
        removePlanningGame(yourUsername, gameName);
        removeCompletedGame(yourUsername, gameName);
        removeCurrentGame(yourUsername, gameName);
    }

    function removeDroppedGame(yourUsername, gameName, gameID, gameImg) { 
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("gameName", gameName);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${yourUsername}/dropped/delete`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newDroppedInfo) {
                let newInfo = Object.assign({}, props.currUserInfo);
                newInfo.Dropped = result.newDroppedInfo.Attributes.Dropped;
                delete newInfo.DroppedGames[gameName];
                props.setCurrUserInfo(newInfo);
                localStorage.setItem('user', JSON.stringify(newInfo));
            }
        })
        .catch(error => error);
        setDropped(false);
    }
    

    function gameStatusButton() {
        document.getElementById("gameStatuses").classList.toggle("show");
    }
    window.onclick = function(event) {
        if (!event.target.matches('.gameStatusBox')) {
          const dropdowns = document.getElementsByClassName("gamestatus-dropdown");
          let i;
          for (i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
            }
          }
        }
      }

    function addUserFeed(yourEmail, yourUsername, idNumber, gameID, gameName, gameImg, action, dateTimeEST) {
        var params1 = {
            TableName: "UserFeed",
            IndexName: "ID-Email-index",
            KeyConditionExpression: "#id = :ID3",
            ExpressionAttributeNames: {
                "#id": "ID",
            },
            ExpressionAttributeValues: {
                ":ID3": "idNumber"
            }
        }
    
        props.docClient.query(params1, function(err, data) {
            if(err) {
                console.log(data, "ID is already being used generating a new ID");
                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                var idStr = idNum.toString();
                addUserFeed(yourEmail, yourUsername, idStr, gameID, gameName, gameImg, action, dateTimeEST);
            } else if (!err) {
                if (data.Count === 0) {
                    console.log(data, "trying to create");
                    var params3 = {
                        TableName: "GameGateAccounts",
                        KeyConditionExpression: "#email = :Email3",
                        ExpressionAttributeNames: {
                            "#email": "Email"
                        },
                        ExpressionAttributeValues: {
                            ":Email3": props.currUserInfo.Email
                        }
                    }
    
                    props.docClient.query(params3, function(err, data) {
                        if (!err) {
                            if (data.Count === 0) {
                                console.log(data);
                            } else {
                                console.log(data);
                                updateUserFeed(yourEmail, yourUsername, idNumber, gameID, gameName, gameImg, action, dateTimeEST, props.currUserInfo.Email);
                                for (var item2 in data.Items[0].FollowersMap) {
                                    console.log(item2, "each follower");
                                    updateUserFeed(yourEmail, yourUsername, idNumber, gameID, gameName, gameImg, action, dateTimeEST, item2);
                                }
                            }

                        } else {
                            console.log(err);
                        }
                    })
                    var params2 = {
                        TableName:"UserFeed",
                        Item:{
                            "Email": yourEmail,
                            "ID": idNumber,
                            "Username": yourUsername,
                            "Action": action,
                            "GameID": gameID,
                            "GameImg": gameImg,
                            "GameName": gameName,
                            "DateOf": dateTimeEST
                        }
                    };
                    props.docClient.put(params2, function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(data, "created")
                        }
                    });
                } else {
                    console.log(data);
                }
            }
        });
    }

    function updateUserFeed(yourEmail, yourUsername, idNumber, gameID, gameName, gameImg, action, dateTimeEST, item2) {
        var params = {               
            TableName:"GameGateAccounts",            
            Key:{
                "Email": item2
            },
            UpdateExpression: "SET #uf = list_append(#uf, :feed)",
            ExpressionAttributeNames: {
                "#uf": "UserFeedIDs",
            },
            ExpressionAttributeValues:{
                ":feed": [{
                    "Email": yourEmail,
                    "ID": idNumber,
                    "Username": yourUsername,
                    "Action": action,
                    "GameID": gameID,
                    "GameImg": gameImg,
                    "GameName": gameName,
                    "DateOf": dateTimeEST
                }]
            },
            ReturnValues:"UPDATED_NEW"
        };

        props.docClient.update(params, function(err, data) {
            if (err) {
                console.log(err);
            }else {
                console.log("Updated the userfeed of", item2);
            }
        })
    }

    function changeScore(val) {
        if(val > 10) {
            setReviewScore(10);
        } else if(val < 0) {
            setReviewScore(0);
        } else {
            setReviewScore(val);
        }
    }

    return (
            <div className="new-parent">
                {isPending && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {results && 
                <div className="new-child">
                    <div className="coverTitleContainer">
                        <img className="coverArt" src={`https:${results[0].cover.url}`} alt="Game cover art"/>
                        
                       
                        <div className="dropdown">
                        {props.loggedIn && <button id="gameStatusText" className="gameStatusBox" onClick={() => gameStatusButton()}>Add to list</button>}
                            <div id="gameStatuses" className="gamestatus-dropdown">
                                {!planning && props.loggedIn && <h2 className="list_entry" onClick={() => planningGames(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Planning</h2>}
                                {planning && props.loggedIn && <h2 className="list_entry" onClick={() => removePlanningGame(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Remove from Planning</h2>}
                                
                                {!currentG && props.loggedIn && <h2 className="list_entry" onClick={() => currentGames(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Playing</h2>}
                                {currentG && props.loggedIn && <h2 className="list_entry" onClick={() => removeCurrentGame(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Remove from Playing</h2>}
                                
                                {!completed && props.loggedIn && <h2 className="list_entry" onClick={() => completedGames(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Completed</h2>}
                                {completed && props.loggedIn && <h2 className="list_entry" onClick={() => removeCompletedGame(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Remove from Completed</h2>}
                                
                                {!dropped && props.loggedIn && <h2 className="list_entry" onClick={() => droppedGames(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Dropped</h2>}
                                {dropped && props.loggedIn && <h2 className="list_entry" onClick={() => removeDroppedGame(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Remove from Dropped</h2>}
                            </div>
                        </div>
                    </div>
                    <hr className="rounded"/>
                    <div className="gameDescrip">
                        <h1>{results[0].name + ' (' + results[0].first_release_date + ')'}</h1>
                        <p>Platforms: {combineAll(results[0].platforms)}</p>
                        <p>{results[0].summary}</p>
                        <p>Genres: {combineAll(results[0].genres)}</p>
                        <h2>Average Rating: {score}</h2>
                    </div>
                </div> }
                <div className="game-reviews">
                    <h1>Reviews</h1>
                    {props.loggedIn && !reviewOpened && results && <button className="reviewBtn" onClick={() => setReviewOpened(true)}>Write a review</button>}
                    {reviewOpened &&
                    <div className="reviewBox">
                    <textarea id="gamereview" placeholder="Write a review" name="review" rows="8" cols="90" value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
                        <div className="scoreandtext"></div>
                        <input type="number" id="scorereview" name="quantity" min="1" max="10" value={reviewScore} onChange={(e) => changeScore(e.target.value)}></input>
                        <div>
                            <input className="reviewBtn" type="submit" value="Publish" onClick={() => updateReviews(results[0].name, props.currUserInfo.Email, props.currUser, reviewText, reviewScore, results[0].smallCover, props.currUserInfo.ProfilePicture)}/>
                        </div>
                    </div> }
                    {
                        reviewInfo.map(val => (
                            <Review upvotes={val.Upvotes[props.currUserInfo.Email]} currUserInfo={props.currUserInfo} docClient={props.docClient} yourUsername={props.currUser} username2={val.Username} username={val.Username} content={val.Review} score={val.Rating} profPic={val.ProfilePic} UpvotesCount={val.UpvotesCount} gameID={results[0].id} key={val.Username}/>
                        ))
                    }
                </div>
            </div>
    );
}
 
export default GameDetails;