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
            // console.log(props.currUserInfo);
            checkPlanning();
            checkCurrent();
            checkCompleted();
            checkDropped();
            // console.log(props.currUserInfo);
            // console.log(results);
        }
    }, [props.completion, results]);

    const checkUpvote = async () => {
        if (results != undefined) {
            await gameStatusMap(results[0].name, "CurrentGames")
        }
    }

    const checkPlanning = async () => {
        // console.log('not amazing');
        // console.log(props.currUserInfo);
        // if(props.currUserInfo.PlanningGames != undefined && results != undefined) {
        //     if(typeof(props.currUserInfo.PlanningGames.values) !== typeof(props.currUserInfo.PlanningGames)) {
        //         let arr = Array.from(props.currUser.PlanningGames, ([name, keys]) => ({name, keys}));
        //         for(let i of arr) {
        //             // console.log(i);
        //             if(i.name === results[0].name) {
        //                 console.log(i);
        //                 setPlanning(true);
        //             }
        //         }
        //     } else {
        //         for(let i of props.currUserInfo.PlanningGames.values) {
        //             // console.log
        //             if(i === results[0].name) {
        //                 console.log(i);
        //                 setPlanning(true);
        //             }
        //         }
        //     }
        // }
        if (results != undefined) {
            await gameStatusMap(results[0].name, "PlanningGames")
        }
    }

    const checkCurrent = async () => {
        if (results != undefined) {
            await gameStatusMap(results[0].name, "CurrentGames")
        }
    }

    const checkCompleted = async () => {
        if (results != undefined) {
            await gameStatusMap(results[0].name, "CompletedGames")
        }
    }

    const checkDropped = async () => {
        if (results != undefined) {
            await gameStatusMap(results[0].name, "DroppedGames")
        }
    }

    const gameStatusMap = (gameName, gameStatus) => {
        var params1 = {
            TableName:"GameGateAccounts",
            KeyConditionExpression: "#email = :email3",
            FilterExpression: "attribute_exists(#gs.#gn.GameName)",
            ExpressionAttributeNames: {
                "#email": "Email",
                "#gs": gameStatus,
                "#gn": gameName
            },
            ExpressionAttributeValues: {
                ":email3": props.currUserInfo.Email
            }
        };
        props.docClient.query(params1, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                if (data.Items.length !== 0) {
                    console.log("game status:", gameStatus);

                    let pg = (gameStatus === "PlanningGames") ? true : false;
                    setPlanning(pg);

                    let complG = (gameStatus === "CompletedGames") ? true : false;
                    setCurrentG(complG);

                    let currG = (gameStatus === "CurrentGames") ? true : false;
                    setCurrentG(currG);

                    let dg = (gameStatus === "DroppedGames") ? true : false;
                    setDropped(dg);

                    console.log(planning, "planning", completed, "completed", currentG, "currentG", dropped, "dropped");
                }
            }
        });
    }

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
                "ProfilePic": profPic,
                "Upvotes": {},
                "UpvotesCount": 0
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
                            ProfilePic: profPic,
                            Upvotes: {},
                            UpvotesCount: 0
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
                        ProfilePic: profPic,
                        Upvotes: {},
                        UpvotesCount: 0
                    });
                }
                // console.log(moreReviewInfo);
                updateScore(moreReviewInfo);
                setReviewInfo(moreReviewInfo);
                setReviewScore('');
                setReviewText('');
            } else {
                console.log(err);
            }
        })
        //update the list of reviews for game and user tables
    }

    function updateScore(moreReviewInfo) {
        let newScore = 0;
        for(let i = 0; i < moreReviewInfo.length; i++) {
            newScore += parseInt(moreReviewInfo[i].Rating);
        }
        newScore = newScore / moreReviewInfo.length;
        newScore = Math.round(newScore * 100) / 100;
        setScore(newScore);
        // console.log(newScore);
    }

    function planningGames(yourUsername, gameName, gameID, gameImg) { 
        console.log(results[0], "results");
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
                            UpdateExpression: "SET #pg.#gn = :gameMap, Planning = Planning + :val" ,
                            ConditionExpression: "attribute_not_exists(#pg.#gn.GameName)",
                            ExpressionAttributeNames: {
                                "#pg": "PlanningGames",
                                "#gn": gameName
                            },
                            ExpressionAttributeValues:{
                                ":gameMap": {
                                    "GameName": gameName,
                                    "GameID": gameID,
                                    "GameCover": gameImg
                                },
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                // console.log(data);
                                let newInfo = Object.assign({}, props.currUserInfo);
                                newInfo.Planning = data.Attributes.Planning;
                                newInfo.PlanningGames = data.Attributes.PlanningGames;
                                props.setCurrUserInfo(newInfo);
                                localStorage.setItem('user', JSON.stringify(newInfo));
                                console.log(newInfo);
                                console.log("The game added to PlanningGames is:", gameName);
                            }
                        });
                    })
                }
            }
        })
        setPlanning(true);
        console.log(planning);
        removeCompletedGame(yourUsername, gameName);
        removeCurrentGame(yourUsername, gameName);
        removeDroppedGame(yourUsername, gameName);
    }

    function removePlanningGame(yourUsername, gameName, gameID, gameImg) { 
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
                            UpdateExpression: "REMOVE #pg.#gn SET Planning = Planning - :val" ,
                            ConditionExpression: "attribute_exists(#pg.#gn.GameName)",
                            ExpressionAttributeNames: {
                                "#pg": "PlanningGames",
                                "#gn": gameName
                            },
                            ExpressionAttributeValues:{
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                // console.log(data);
                                console.log("The game removed from PlanningGames is:", gameName);
                                let newInfo = Object.assign({}, props.currUserInfo);
                                newInfo.Planning = data.Attributes.Planning;
                                newInfo.PlanningGames = data.Attributes.PlanningGames;
                                props.setCurrUserInfo(newInfo);
                                localStorage.setItem('user', JSON.stringify(newInfo));
                                console.log(newInfo);
                            }
                        });
                    })
                }
            }
        })
        setPlanning(false);
    }

    function completedGames(yourUsername, gameName, gameID, gameImg) { 
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
                            UpdateExpression: "SET #cg.#gn = :gameMap, Completed = Completed + :val" ,
                            ConditionExpression: "attribute_not_exists(#cg.#gn.GameName)",
                            ExpressionAttributeNames: {
                                "#cg": "CompletedGames",
                                "#gn": gameName
                            },
                            ExpressionAttributeValues:{
                                ":gameMap": {
                                    "GameName": gameName,
                                    "GameID": gameID,
                                    "GameCover": gameImg
                                },
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
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
        setCompleted(true);
        removePlanningGame(yourUsername, gameName);
        removeCurrentGame(yourUsername, gameName);
        removeDroppedGame(yourUsername, gameName);
    }

    function removeCompletedGame(yourUsername, gameName, gameID, gameImg) { 
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
                            UpdateExpression: "REMOVE #cg.#gn SET Completed = Completed - :val" ,
                            ConditionExpression: "attribute_exists(#cg.#gn.GameName)",
                            ExpressionAttributeNames: {
                                "#cg": "CompletedGames",
                                "#gn": gameName
                            },
                            ExpressionAttributeValues:{
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
        setCompleted(false);
    }

    function currentGames(yourUsername, gameName, gameID, gameImg) { 
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
                            UpdateExpression: "SET #cg.#gn = :gameMap, CurrentG = CurrentG + :val" ,
                            ConditionExpression: "attribute_not_exists(#cg.#gn.GameName)",
                            ExpressionAttributeNames: {
                                "#cg": "CurrentGames",
                                "#gn": gameName
                            },
                            ExpressionAttributeValues:{
                                ":gameMap": {
                                    "GameName": gameName,
                                    "GameID": gameID,
                                    "GameCover": gameImg
                                },
                                ":val": 1,
                            },
                        }
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
        setCurrentG(true)
        removePlanningGame(yourUsername, gameName);
        removeCompletedGame(yourUsername, gameName);
        removeDroppedGame(yourUsername, gameName);
    }

    function removeCurrentGame(yourUsername, gameName, gameID, gameImg) { 
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
                            UpdateExpression: "REMOVE #cg.#gn SET CurrentG = CurrentG - :val" ,
                            ConditionExpression: "attribute_exists(#cg.#gn.GameName)",
                            ExpressionAttributeNames: {
                                "#cg": "CurrentGames",
                                "#gn": gameName
                            },
                            ExpressionAttributeValues:{
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
        setCurrentG(false);
    }

    function droppedGames(yourUsername, gameName, gameID, gameImg) { 
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
                            UpdateExpression: "SET #dg.#gn = :gameMap, Dropped = Dropped + :val" ,
                            ConditionExpression: "attribute_not_exists(#dg.#gn.GameName)",
                            ExpressionAttributeNames: {
                                "#dg": "DroppedGames",
                                "#gn": gameName
                            },
                            ExpressionAttributeValues:{
                                ":gameMap": {
                                    "GameName": gameName,
                                    "GameID": gameID,
                                    "GameCover": gameImg
                                },
                                ":val": 1,
                            },
                        }
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
        setDropped(true);
        removePlanningGame(yourUsername, gameName);
        removeCompletedGame(yourUsername, gameName);
        removeCurrentGame(yourUsername, gameName);
    }

    function removeDroppedGame(yourUsername, gameName, gameID, gameImg) { 
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
                            UpdateExpression: "REMOVE #dg.#gn SET Dropped = Dropped - :val" ,
                            ConditionExpression: "attribute_exists(#dg.#gn.GameName)",
                            ExpressionAttributeNames: {
                                "#dg": "DroppedGames",
                                "#gn": gameName
                            },
                            ExpressionAttributeValues:{
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
        setDropped(false);
    }

    function addUpvote(yourUsername, theirUsername, gameID) { 
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
                            TableName:"Games",
                                Key:{
                                "GameID": gameID,
                                "Username": theirUsername
                            },
                            UpdateExpression: "SET #uv.#em = :upvote, UpvotesCount = UpvotesCount + :val" ,
                            ConditionExpression: "attribute_not_exists(#uv.#em.Username)",
                            ExpressionAttributeNames: {
                                "#uv": "Upvotes",
                                "#em": item.Email
                            },
                            ExpressionAttributeValues:{
                                ":upvote": {
                                    "Username": yourUsername,
                                    "ProfilePicture": item.ProfilePic,
                                },
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                                removeUpvote(yourUsername, theirUsername, gameID);
                            } else {
                                console.log(data);
                            }
                        });
                    })
                }
            }
        })
        console.log("upvote added");
    }

    function removeUpvote(yourUsername, theirUsername, gameID) { 
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
                            TableName:"Games",
                                Key:{
                                "GameID": gameID,
                                "Username": theirUsername
                            },
                            UpdateExpression: "REMOVE #uv.#em SET UpvotesCount = UpvotesCount - :val" ,
                            ConditionExpression: "attribute_exists(#uv.#em.GameName)",
                            ExpressionAttributeNames: {
                                "#uv": "Upvotes",
                                "#em": item.Email
                            },
                            ExpressionAttributeValues:{
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data)
                            }
                        });
                    })
                }
            }
        })
        console.log("upvote removed");
    }

    return (
            <div className="new-parent">
                {isPending && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {results && 
                <div className="new-child">
                    <div className="coverTitleContainer">
                        <img className="coverArt" src={`https:${results[0].cover.url}`} alt="Game cover art"/>
                        {!planning && props.loggedIn && <button type="button" className="list_entry" onClick={() => planningGames(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Planning</button>}
                        {planning && props.loggedIn && <button type="button" className="list_entry" onClick={() => removePlanningGame(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Remove from Planning</button>}
                        
                        {!currentG && props.loggedIn && <button type="button" className="list_entry" onClick={() => currentGames(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Playing</button>}
                        {currentG && props.loggedIn && <button type="button" className="list_entry" onClick={() => removeCurrentGame(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Remove from Playing</button>}

                        {!completed && props.loggedIn && <button type="button" className="list_entry" onClick={() => completedGames(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Completed</button>}
                        {completed && props.loggedIn && <button type="button" className="list_entry" onClick={() => removeCompletedGame(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Remove from Completed</button>}

                        {!dropped && props.loggedIn && <button type="button" className="list_entry" onClick={() => droppedGames(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Dropped</button>}
                        {dropped && props.loggedIn && <button type="button" className="list_entry" onClick={() => removeDroppedGame(props.currUser, results[0].name, results[0].id, results[0].smallCover)}>Remove from Dropped</button>}
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
                            <Review username={val.Username} content={val.Review} score={val.Rating} profPic={val.ProfilePic} UpvotesCount={val.UpvotesCount} key={val.Username}/>
                        ))
                    }
                </div>
            </div>
    );
}
 
export default GameDetails;
