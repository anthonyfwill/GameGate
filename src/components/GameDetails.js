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
        setReviewOpened(false);
        var params = {
            TableName: "Games",
            Item: {
                "GameID": id,
                "GameName": gameName,
                "Email": email,
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
                            Email: email,
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
                        Email: email,
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
                                const action = yourUsername + " is planning to play " + gameName;
                                console.log(action);
                                var dateTime = new Date();
                                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                                console.log(dateTimeEST);
                                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                                let idStr = idNum.toString();
                                addUserFeed(item.Email, yourUsername, idStr, gameID, gameName, gameImg, action, dateTimeEST);
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

    function removePlanningGame(yourUsername, gameName, gameID, gameImg, dateTime) { 
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
                                const action = yourUsername + " has completed " + gameName;
                                console.log(action);
                                var dateTime = new Date();
                                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                                console.log(dateTimeEST);
                                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                                let idStr = idNum.toString();
                                addUserFeed(item.Email, yourUsername, idStr, gameID, gameName, gameImg, action, dateTimeEST);
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
                                const action = yourUsername + " is currently playing " + gameName;
                                console.log(action);
                                var dateTime = new Date();
                                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                                console.log(dateTimeEST);
                                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                                let idStr = idNum.toString();
                                addUserFeed(item.Email, yourUsername, idStr, gameID, gameName, gameImg, action, dateTimeEST);
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
                                const action = yourUsername + " has dropped " + gameName;
                                console.log(action);
                                var dateTime = new Date();
                                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                                console.log(dateTimeEST);
                                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                                let idStr = idNum.toString();
                                addUserFeed(item.Email, yourUsername, idStr, gameID, gameName, gameImg, action, dateTimeEST);
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

    function addUpvote(yourUsername, theirUsername, gameID) { 
        console.log("upvote");
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": theirUsername
            }
        }
        console.log(yourUsername, theirUsername, gameID);
        props.docClient.query(params2, function(err, data) {
            if (err) {
                console.log(err);
            }else if (!err) {
                if (data.Count === 0) {
                    //console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        console.log(item, "itemmmmm");
                        var params1 = {
                            TableName:"Games",
                                Key:{
                                "GameID": id,
                                "Email": item.Email
                            },
                            UpdateExpression: "SET #uv.#em = :upvote, UpvotesCount = UpvotesCount + :val" ,
                            ConditionExpression: "attribute_not_exists(#uv.#em.Username)",
                            ExpressionAttributeNames: {
                                "#uv": "Upvotes",
                                "#em": props.currUserInfo.Email
                            },
                            ExpressionAttributeValues:{
                                ":upvote": {
                                    "Username": yourUsername,
                                },
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
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
        console.log("remove upvote");
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": theirUsername
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        console.log(item, "itemmmmm");
                        var params1 = {
                            TableName:"Games",
                                Key:{
                                "GameID": id,
                                "Email": item.Email
                            },
                            UpdateExpression: "REMOVE #uv.#em SET UpvotesCount = UpvotesCount - :val" ,
                            ConditionExpression: "attribute_exists(#uv.#em.Username)",
                            ExpressionAttributeNames: {
                                "#uv": "Upvotes",
                                "#em": props.currUserInfo.Email
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

    return (
            <div className="new-parent">
                {isPending && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {results && 
                <div className="new-child">
                    <div className="coverTitleContainer">
                        <img className="coverArt" src={`https:${results[0].cover.url}`} alt="Game cover art"/>
                        
                       
                        <div className="dropdown">
                        <button id="gameStatusText" className="gameStatusBox" onClick={() => gameStatusButton()}>Add to list</button>
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
                    {props.loggedIn && !reviewOpened && <button className="reviewBtn" onClick={() => setReviewOpened(true)}>Write a review</button>}
                    {reviewOpened &&
                    <div className="reviewBox">
                    <textarea id="gamereview" placeholder="Write a review" name="review" rows="8" cols="90" value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
                        <div className="scoreandtext"></div>
                        {/* <input type="number" id="scorereview" name="quantity" min="1" max="10"></input> */}
                        <textarea id="scorereview" maxLength="2" placeholder="Score / 10" pattern="\d$" value={reviewScore} onChange={(e) => setReviewScore(e.target.value)}></textarea>
                        <div>
                            <input className="reviewBtn" type="submit" value="Publish" onClick={() => updateReviews(results[0].name, props.currUserInfo.Email, props.currUser, reviewText, reviewScore, results[0].smallCover, props.currUserInfo.ProfilePicture)}/>
                        </div>
                    </div> }
                    {
                        reviewInfo.map(val => (
                            <div>
                            <Review yourUsername={props.currUser} username2={val.Username} username={val.Username} content={val.Review} score={val.Rating} profPic={val.ProfilePic} UpvotesCount={val.UpvotesCount} gameID={results[0].id} key={val.Username}/>
                                {props.currUser !== val.Username &&
                                    <button type="button" className="list_entry" onClick={() =>addUpvote(props.currUser, val.Username, results[0].id)}>Upvotes</button>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
    );
}
 
export default GameDetails;
