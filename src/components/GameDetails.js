import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import Review from "./Review";

const GameDetails = (props) => {
    const { id } = useParams();

    const { results, isPending, error, reviewInfo, setReviewInfo } = useFetch(id, props.docClient);
    const [reviewOpened, setReviewOpened] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewScore, setReviewScore] = useState('');

    function combineAll(array) {
        const output = [];
        for(let i = 0; i < array.length; i++) {
            output.push(array[i].name);
        }
        return output.join(', ');
    }
    //All reviews for a game (Just have to loop through game api and with the parameter of the gameID which is "gameID" in this function)
        // var params2 = {
        //     TableName: "Games",
        //     //ProjectionExpression: "#gameID",
        //     KeyConditionExpression: "#gameID = :gameID3",
        //     ExpressionAttributeNames: {
        //         "#gameID": "GameID",
        //     },
        //     ExpressionAttributeValues: {
        //         ":gameID3": id
        //     }
        // }

        // props.docClient.query(params2, function(err, data) {
        //     if (!err) {
        //         if (data.Count === 0) {
        //             console.log(data);
        //         } else {
        //             console.log(data);
        //         }
        //     } else {
        //         console.log(err);
        //     }
        // })

        /*var params3 = {
            TableName: "Games",
            Item: {
                "GameID": id,
                "Username": Username,
                "Review": review,
            },

        }

        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);

                }
            } else {
                console.log(err);
            }
        })*/

        /*var params2 = {
            TableName: "Games",
            KeyConditionExpression: "#gameID = :gameID3 and #username = :username",
            ExpressionAttributeNames: {
                "#gameID": "GameID",
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":gameID3": id,
                ":username": username
            }
        }

        props.docClient.put(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);

                }
            } else {
                console.log(err);
            }
        })*/

        //ADD ITEMS**********************88
        /*var params = {
            TableName: "Games",
            Item: {
                "GameID": gameID,
                "Username": username,
                "Review": review,
                "Rating": rating
            }
        }

        props.docClient.query(params, function(err, data) {
            if (!err) {
                //console.log("no error");
                //console.log(data, "Email entered: " + email);
                if (data.Count === 0) {
                    console.log("Email available");
                    canMake = canMake + 1;
                } else {
                    console.log("Email is not available");
                }
            } else {
                canMake += 1
                console.log(err);
            }
        })*/

    /*function addPlanning(e) {
        if(e.target.textContent === 'Add to planning') {
            e.target.textContent = 'Planning'
            //add code to update planning count for user and add game id to list of games user is planning on playing
        } else {
            e.target.textContent = 'Add to planning'
            //decrement planning count for user and remove game id from list of games user is planning to play
        }
    }*/

    function updateReviews(gameName, username, reviewText, reviewScore, gameImg, profPic) {
        setReviewOpened(false);
        var params = {
            TableName: "Games",
            Item: {
                "GameID": id,
                "GameName": gameName,
                "Username": username,
                "Review": reviewText,
                "Rating": reviewScore,
                "GameImage": gameImg,
                "ProfilePic": profPic
            }
        }
        //console.log(results[0].name, props.currUser, reviewText, reviewScore)

        props.docClient.put(params, function(err, data) {
            if (!err) {
                console.log(reviewText, reviewScore);
                const moreReviewInfo = [...reviewInfo];
                let found = false;
                for(let i = 0; i < moreReviewInfo.length; i++) {
                    console.log(moreReviewInfo[i]);
                    if(moreReviewInfo[i].Username === username) {
                        console.log("found one!");
                        moreReviewInfo[i] = {
                            GameID: id,
                            GameName: gameName,
                            Username: username,
                            Review: reviewText,
                            Rating: reviewScore,
                            GameImage: gameImg,
                            ProfilePic: profPic
                        }
                        found = true;
                    }
                }
                if(!found) {
                    moreReviewInfo.push({
                        GameID: id,
                        GameName: gameName,
                        Username: username,
                        Review: reviewText,
                        Rating: reviewScore,
                        GameImage: gameImg,
                        ProfilePic: profPic
                    });
                }
                setReviewInfo(moreReviewInfo);
                setReviewScore('');
                setReviewText('');
            } else {
                console.log(err);
            }
        })
        //update the list of reviews for game and user tables
    }

    function planningGames(yourUsername, gameName) { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": yourUsername
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "ADD #pg :gameList SET Planning = Planning + :val" ,
                            ConditionExpression: "not contains(#pg, :gameString)",
                            ExpressionAttributeNames: {
                                "#pg": "PlanningGames"
                            },
                            ExpressionAttributeValues:{
                                ":gameList": props.docClient.createSet([gameName]),
                                ":gameString": gameName,
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("The game added to PlanningGames is:", gameName);
                            }
                        });
                    })
                }
            }
        })
        removeCompletedGame(yourUsername, gameName);
        removeCurrentGame(yourUsername, gameName);
        removeDroppedGame(yourUsername, gameName);
    }

    function removePlanningGame(yourUsername, gameName) { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": yourUsername
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "DELETE #pg :gameList SET Planning = Planning - :val" ,
                            ConditionExpression: "contains(#pg, :gameString)",
                            ExpressionAttributeNames: {
                                "#pg": "PlanningGames"
                            },
                            ExpressionAttributeValues:{
                                ":gameList": props.docClient.createSet([gameName]),
                                ":gameString": gameName,
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("The game removed from PlanningGames is:", gameName);
                            }
                        });
                    })
                }
            }
        })
    }

    function completedGames(yourUsername, gameName) { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": yourUsername
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "ADD #cg :gameList SET Completed = Completed + :val" ,
                            ConditionExpression: "not contains(#cg, :gameString)",
                            ExpressionAttributeNames: {
                                "#cg": "CompletedGames"
                            },
                            ExpressionAttributeValues:{
                                ":gameList": props.docClient.createSet([gameName]),
                                ":gameString": gameName,
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("The game added to CompletedGames is:", gameName);
                            }
                        });
                    })
                }
            }
        })
        removePlanningGame(yourUsername, gameName);
        removeCurrentGame(yourUsername, gameName);
        removeDroppedGame(yourUsername, gameName);
    }

    function removeCompletedGame(yourUsername, gameName) { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": yourUsername
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "DELETE #cg :gameList SET Completed = Completed - :val" ,
                            ConditionExpression: "contains(#cg, :gameString)",
                            ExpressionAttributeNames: {
                                "#cg": "CompletedGames"
                            },
                            ExpressionAttributeValues:{
                                ":gameList": props.docClient.createSet([gameName]),
                                ":gameString": gameName,
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("The game removed from CompletedGames is:", gameName);
                            }
                        });
                    })
                }
            }
        })
    }

    function currentGames(yourUsername, gameName) { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": yourUsername
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "ADD #cg :gameList SET CurrentG = CurrentG + :val" ,
                            ConditionExpression: "not contains(#cg, :gameString)",
                            ExpressionAttributeNames: {
                                "#cg": "CurrentGames"
                            },
                            ExpressionAttributeValues:{
                                ":gameList": props.docClient.createSet([gameName]),
                                ":gameString": gameName,
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("The game added to CurrentGames is:", gameName);
                            }
                        });
                    })
                }
            }
        })
        removePlanningGame(yourUsername, gameName);
        removeCompletedGame(yourUsername, gameName);
        removeDroppedGame(yourUsername, gameName);
    }

    function removeCurrentGame(yourUsername, gameName) { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": yourUsername
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "DELETE #cg :gameList SET CurrentG = CurrentG - :val" ,
                            ConditionExpression: "contains(#cg, :gameString)",
                            ExpressionAttributeNames: {
                                "#cg": "CurrentGames"
                            },
                            ExpressionAttributeValues:{
                                ":gameList": props.docClient.createSet([gameName]),
                                ":gameString": gameName,
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("The game dropped from CurrentGames is:", gameName);
                            }
                        });
                    })
                }
            }
        })
    }

    function droppedGames(yourUsername, gameName) { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": yourUsername
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "ADD #dg :gameList SET Dropped = Dropped + :val" ,
                            ConditionExpression: "not contains(#dg, :gameString)",
                            ExpressionAttributeNames: {
                                "#dg": "DroppedGames"
                            },
                            ExpressionAttributeValues:{
                                ":gameList": props.docClient.createSet([gameName]),
                                ":gameString": gameName,
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("The game added to DroppedGames is:", gameName);
                            }
                        });
                    })
                }
            }
        })
        removePlanningGame(yourUsername, gameName);
        removeCompletedGame(yourUsername, gameName);
        removeCurrentGame(yourUsername, gameName);
    }

    function removeDroppedGame(yourUsername, gameName) { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": yourUsername
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "DELETE #dg :gameList SET Dropped = Dropped - :val" ,
                            ConditionExpression: "contains(#dg, :gameString)",
                            ExpressionAttributeNames: {
                                "#dg": "DroppedGames"
                            },
                            ExpressionAttributeValues:{
                                ":gameList": props.docClient.createSet([gameName]),
                                ":gameString": gameName,
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("The game dropped from DroppedGames is:", gameName);
                            }
                        });
                    })
                }
            }
        })
    }

    return (
            <div className="new-parent">
                {isPending && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {results && 
                <div className="new-child">
                    <div className="coverTitleContainer">
                        <img className="coverArt" src={`https:${results[0].cover.url}`} alt="Game cover art"/>
                        {props.loggedIn && <button type="button" className="list_entry" onClick={() => planningGames(props.currUser, results[0].name)}>Planning</button>}
                        {props.loggedIn && <button type="button" className="list_entry" onClick={() => currentGames(props.currUser, results[0].name)}>Playing</button>}
                        {props.loggedIn && <button type="button" className="list_entry" onClick={() => completedGames(props.currUser, results[0].name)}>Completed</button>}
                        {props.loggedIn && <button type="button" className="list_entry" onClick={() => droppedGames(props.currUser, results[0].name)}>Dropped</button>}
                    </div>
                    <hr className="rounded"/>
                    <div className="gameDescrip">
                        <h1>{results[0].name + ' (' + results[0].first_release_date + ')'}</h1>
                        <p>Platforms: {combineAll(results[0].platforms)}</p>
                        <p>{results[0].summary}</p>
                        <p>Genres: {combineAll(results[0].genres)}</p>
                    </div>
                </div> }
                <div className="game-reviews">
                    <h1>Reviews</h1>
                    {props.loggedIn && !reviewOpened && <button className="reviewBtn" onClick={() => setReviewOpened(true)}>Write a review</button>}
                    {reviewOpened &&
                    <div className="reviewBox">
                    <textarea id="gamereview" placeholder="Write a review" name="review" rows="8" cols="90" value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
                        <div className="scoreandtext"></div>
                        {/* <input type="number" id="scorereview" name="quantity" min="1" max="10"></input> */}
                        <textarea id="scorereview" maxLength="2" placeholder="Score / 10" pattern="\d$" value={reviewScore} onChange={(e) => setReviewScore(e.target.value)}></textarea>
                        <div>
                            <input className="reviewBtn" type="submit" value="Publish" onClick={() => updateReviews(results[0].name, props.currUser, reviewText, reviewScore, results[0].smallCover, props.currUserInfo.ProfilePicture)}/>
                        </div>
                    </div> }
                    {
                        reviewInfo.map(val => (
                            <Review username={val.Username} content={val.Review} score={val.Rating} profPic={val.ProfilePic} key={val.Username}/>
                        ))
                    }
                </div>
            </div>
    );
}
 
export default GameDetails;
