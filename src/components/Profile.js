import Review from "./Review";
import { useParams } from "react-router-dom";
import * as AWS from 'aws-sdk';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:'us-east-1:1f1634e0-e85f-4ffe-a509-ecb75c777309'});
var myConfig = new AWS.Config({
  credentials: myCredentials, region: 'us-east-1'
});

AWS.config.update(myConfig)

const docClient = new AWS.DynamoDB.DocumentClient()

const Profile = (props) => {
    const [results, setResults] = useState(null);
    const [isPending, setPending] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [error, setError] = useState(null);
    const [reviewInfo, setReviewInfo] = useState([]);
    const [following, setFollowing] = useState(false);
    const [notFollowing, setNotFollowing] = useState(false);

    const {username} = useParams();

    useEffect(() => {
        if(!requesting && (results === null || results.Username !== username)) {
            setRequesting(true);
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            fetch('http://localhost:5000/api/user/' + username, requestOptions)
            .then(response => {
                if(!response.ok) {
                    throw Error('User does not exist');
                }
                return response.json()
            })
            .then(result => {
                setReviewInfo(result.reviews.Items);
                setResults(result.user.Items[0]);
                setPending(false);
                setError(null);
                setRequesting(false);
            })
            .catch(error => {
                setError(error.message);
                setPending(false);
            });
        }
        console.log(following);
        if(props.currUserInfo) {
            // console.log(props.currUserInfo);
            checkFollowing();
            console.log(props.currUserInfo);
        }
    }, [username, props.completion])

    const checkFollowing =  async () => {
        await findUser();
    }

    const findUser = async () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`http://localhost:5000/api/user/${username}/followers`, requestOptions)
        .then(response => {
            if(!response.ok) {
                throw Error('Could not gather user info');
            }
            return response.json();
        })
        .then(results => {
            if(results.Items[0].Followers != 0) {
                for(let i in results.Items[0].FollowersMap) {
                    if(results.Items[0].FollowersMap[i].Username == props.currUser) {
                        setFollowing(true);
                    }
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

     const increaseFollowing = (yourUsername, theirUsername, yourProfilePicture, theirProfilePicture) => { 
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
    
        docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": props.currUserInfo.Email,
                            },
                            UpdateExpression: "SET #fl.#userN = :userViewedName, Following = Following + :val",
                            ConditionExpression: "attribute_not_exists(#fl.#userN.Username)",
                            ExpressionAttributeNames: {
                                "#fl": "FollowingMap",
                                "#userN": item.Email
                            },
                            ExpressionAttributeValues:{
                                ":userViewedName":{
                                    "Username": theirUsername,
                                    "ProfilePicture": theirProfilePicture
                                },
                                ":val": 1
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                let newInfo = Object.assign({}, props.currUserInfo);
                                newInfo.Following = data.Attributes.Following;
                                newInfo.FollowingMap = data.Attributes.FollowingMap;
                                props.setCurrUserInfo(newInfo);
                                localStorage.setItem('user', JSON.stringify(newInfo));
                                console.log(newInfo);
                                console.log("Increased the following count of", yourUsername);
                                const action = yourUsername + " has followed " + theirUsername;
                                console.log(action);
                                var dateTime = new Date();
                                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                                console.log(dateTimeEST);
                                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                                let idStr = idNum.toString();
                                addUserFeed(props.currUserInfo.Email, yourUsername, idStr, theirUsername, yourProfilePicture, theirProfilePicture, action, dateTimeEST);
                            }
                        });
                    })
                }
            }
        })
        setFollowing(true);
        increaseFollowers(yourUsername, theirUsername, yourProfilePicture, theirProfilePicture);
    }



    const decreaseFollowing = (yourUsername, theirUsername, yourProfilePicture, theirProfilePicture) => { 
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
    
        docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": props.currUserInfo.Email,
                            },
                            UpdateExpression: "REMOVE #fl.#userN SET Following = Following - :val",
                            ConditionExpression: "attribute_exists(#fl.#userN.Username)",
                            ExpressionAttributeNames: {
                                "#fl": "FollowingMap",
                                "#userN": item.Email
                            },
                            ExpressionAttributeValues:{
                                ":val": 1
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                // console.log(data);
                                console.log("Decreased the following count of", yourUsername);
                                let newInfo = Object.assign({}, props.currUserInfo);
                                newInfo.Following = data.Attributes.Following;
                                newInfo.FollowingMap = data.Attributes.FollowingMap;
                                props.setCurrUserInfo(newInfo);
                                localStorage.setItem('user', JSON.stringify(newInfo));
                                console.log(newInfo);
                                const action = yourUsername + " has unfollowed " + theirUsername;
                                console.log(action);
                                var dateTime = new Date();
                                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                                console.log(dateTimeEST);
                                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                                let idStr = idNum.toString();
                                addUserFeed(props.currUserInfo.Email, yourUsername, idStr, theirUsername, yourProfilePicture, theirProfilePicture, action, dateTimeEST);
                            }
                        });
                    })
                }
            }
        })
        setFollowing(false);
        decreaseFollowers(yourUsername, theirUsername, yourProfilePicture, theirProfilePicture);
    }

    const increaseFollowers = (yourUsername, viewedUsername, yourProfilePicture, theirProfilePicture) => {  
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": viewedUsername
            }
        }
    
        docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    // console.log(data);
                } else {
                    // console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "SET #fl.#userN = :yourUsername, Followers = Followers + :val",
                            ConditionExpression: "attribute_not_exists(#fl.#userN.Username)",
                            ExpressionAttributeNames: {
                                "#fl": "FollowersMap",
                                "#userN": props.currUserInfo.Email
                            },
                            ExpressionAttributeValues:{
                                ":yourUsername":{
                                    "Username": yourUsername,
                                    "ProfilePicture": yourProfilePicture
                                },
                                ":val": 1
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("Increased the followers count of", username);
                                const action = viewedUsername + " has gained the follower " + yourUsername;
                                console.log(action);
                                var dateTime = new Date();
                                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                                console.log(dateTimeEST);
                                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                                let idStr = idNum.toString();
                                addUserFeed(item.Email, viewedUsername, idStr, yourUsername, theirProfilePicture, yourProfilePicture, action, dateTimeEST);
                            }
                        });
                    })
                }
            }
        })
    }

    
    const decreaseFollowers = (yourUsername, viewedUsername, yourProfilePicture, theirProfilePicture) => { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": viewedUsername
            }
        }
    
        docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    // console.log(data);
                } else {
                    // console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "REMOVE #fl.#userN SET Followers = Followers - :val",
                            ConditionExpression: "attribute_exists(#fl.#userN.Username)",
                            ExpressionAttributeNames: {
                                "#fl": "FollowersMap",
                                "#userN": props.currUserInfo.Email
                            },
                            ExpressionAttributeValues:{
                                ":val": 1
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("Decreased the followers count of", username);
                                const action = viewedUsername + " has lost the follower " + yourUsername;
                                console.log(action);
                                var dateTime = new Date();
                                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                                console.log(dateTimeEST);
                                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                                let idStr = idNum.toString();
                                addUserFeed(item.Email, viewedUsername, idStr, yourUsername, theirProfilePicture, yourProfilePicture, action, dateTimeEST);
                            }
                        });
                    })
                }
            }
        })
    }

    function addUserFeed(yourEmail, yourUsername, idNumber, theirUsername, yourProfilePicture, theirProfilePicture, action, dateTimeEST) {
        var params1 = {
            TableName: "UserFeed",
            IndexName: "ID-Email-index",
            KeyConditionExpression: "#id = :ID3",
            ExpressionAttributeNames: {
                "#id": "ID",
            },
            ExpressionAttributeValues: {
                ":ID3": idNumber
            }
        }
    
        docClient.query(params1, function(err, data) {
            if (err) {
                console.log(err, "ID is already being used generating a new ID");
                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                let idStr = idNum.toString();
                addUserFeed(yourEmail, yourUsername, idStr, theirUsername, yourProfilePicture, theirProfilePicture, action, dateTimeEST)
            }else if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                    var params2 = {
                        TableName:"UserFeed",
                        Item:{
                            "Email": yourEmail,
                            "ID": idNumber,
                            "Username": yourUsername,
                            "Action": action,
                            "theirUsername": theirUsername,
                            "DateOf": dateTimeEST
                        }
                    };
                    docClient.put(params2, function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(data)
                        }
                    });
                } else {
                    console.log(data);
                }
            }
        });
    }

    function addUpvote(yourUsername, theirUsername, gameID) { 
        var id = gameID.toString();
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
        docClient.query(params2, function(err, data) {
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
                        docClient.update(params1, function(err, data) {
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
        var id = gameID.toString();
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
    
        docClient.query(params2, function(err, data) {
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
                        docClient.update(params1, function(err, data) {
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
        <div className='profile-topmost'>
            {isPending && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {results && 
            <div className="profile-container">
                <div className="stats-container">
                    <div className='image-section'>
                        <img id="pfp" src={results.ProfilePicture}/>
                    </div>
                    <div>
                        <h2>{username}</h2>
                        {console.log(following, following)}
                        {!following && props.loggedIn && username != props.currUser && <div><button className="list_entry" type="submit" onClick={() => increaseFollowing(props.currUser, username, props.currUserInfo.ProfilePicture, results.ProfilePicture)}>Follow</button></div> }
                        {following && props.loggedIn && username != props.currUser && <div><button className="list_entry" type="submit" onClick={() => decreaseFollowing(props.currUser, username, props.currUserInfo.ProfilePicture, results.ProfilePicture)}>Unfollow</button></div> }
                    </div>
                    <div className="game-stats">
                        <div className="individual-stat-container">
                            <Link to={`/currentG/${username}`}>
                                <h2>{results.CurrentG}</h2>
                                <p>Current</p>
                            </Link>
                        </div>
                        <div className="individual-stat-container">
                            <Link to={`/completed/${username}`}>
                                <h2>{results.Completed}</h2>
                                <p>Completed</p>
                            </Link>
                        </div>
                        <div className="individual-stat-container">
                            <Link to={`/dropped/${username}`}>
                                <h2>{results.Dropped}</h2>
                                <p>Dropped</p>
                            </Link>
                        </div>
                        <div className="individual-stat-container">
                            <Link to={`/planning/${username}`}>
                                <h2>{results.Planning}</h2>
                                <p>Planning</p>
                            </Link>
                        </div>
                    </div>
                    <div className="follow-stats">
                        <div className="individual-stat-container">
                            <Link to={`/followers/${username}`}>
                                <h2>{results.Followers}</h2>
                                <p>Followers</p>
                            </Link>
                        </div>
                        <div className="individual-stat-container">
                            <Link to={`/following/${username}`}>
                                <h2>{results.Following}</h2>
                                <p>Following</p>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="reviews-container">
                    <div>
                        <h1>Reviews</h1>
                    </div>
                    <div className="reviews">
                        {
                            reviewInfo.map(val => (
                                <div>
                                {console.log(val, "val")}
                                <Review email={props.currUserInfo.Email} yourUsername={props.currUser} username2={username} gameImage={val.GameImage} name={val.GameName} content={val.Review} score={val.Rating} id={val.GameID}  UpvotesCount={val.UpvotesCount} key={val.GameName}/>
                                {console.log(props.currUser, val.Username)}
                                {props.currUser !== username &&
                                    <button type="button" className="list_entry" onClick={() =>addUpvote(props.currUser, username, val.GameID)}>Upvotes</button>
                                }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            }
        </div>
    );
}
 
export default Profile;