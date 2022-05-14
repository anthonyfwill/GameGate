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
    const [upvoteColor, setButtonColor] = useState([]);
    const [finishReading, setReading] = useState(false);
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
            checkFollowing();
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
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("username", yourUsername);
        urlencoded.append("theirEmail", results.Email);
        urlencoded.append("theirProfilePicture", theirProfilePicture);
        urlencoded.append("theirUsername", theirUsername);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${yourUsername}/following`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newFollowingsInfo) {
                let newInfo = Object.assign({}, props.currUserInfo);
                newInfo.Following = result.newFollowingsInfo.Attributes.Following;
                newInfo.FollowingMap[results.Email] = result.newFollowingsInfo.Attributes.FollowingMap[results.Email];
                props.setCurrUserInfo(newInfo);
                localStorage.setItem('user', JSON.stringify(newInfo));
                const action = yourUsername + " has followed " + theirUsername;
                var dateTime = new Date();
                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                let idStr = idNum.toString();
                addUserFeed(props.currUserInfo.Email, yourUsername, idStr, theirUsername, yourProfilePicture, theirProfilePicture, action, dateTimeEST);
            }
        })
        .catch(error => console.log('error', error)); 
        setFollowing(true);
        increaseFollowers(yourUsername, theirUsername, yourProfilePicture, theirProfilePicture);
    }



    const decreaseFollowing = (yourUsername, theirUsername, yourProfilePicture, theirProfilePicture) => { 
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("theirEmail", results.Email);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${yourUsername}/following/delete`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newFollowingsInfo) {
                let newInfo = Object.assign({}, props.currUserInfo);
                newInfo.Following = result.newFollowingsInfo.Attributes.Following;
                delete newInfo.FollowingMap[results.Email];
                props.setCurrUserInfo(newInfo);
                localStorage.setItem('user', JSON.stringify(newInfo));
                const action = yourUsername + " has unfollowed " + theirUsername;
                var dateTime = new Date();
                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                let idStr = idNum.toString();
                addUserFeed(props.currUserInfo.Email, yourUsername, idStr, theirUsername, yourProfilePicture, theirProfilePicture, action, dateTimeEST);
            }
        })
        .catch(error => console.log('error', error)); 
        setFollowing(false);
        decreaseFollowers(yourUsername, theirUsername, yourProfilePicture, theirProfilePicture);
    }

    const increaseFollowers = (yourUsername, viewedUsername, yourProfilePicture, theirProfilePicture) => {  
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("username", yourUsername);
        urlencoded.append("theirEmail", results.Email);
        urlencoded.append("profilePic", yourProfilePicture);
        urlencoded.append("theirProfilePicture", theirProfilePicture);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${viewedUsername}/followers`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newFollowersInfo) {
                let newInfo = Object.assign({}, results);
                newInfo.Followers = result.newFollowersInfo.Attributes.Followers;
                newInfo.FollowersMap[props.currUserInfo.Email] = result.newFollowersInfo.Attributes.FollowersMap[props.currUserInfo.Email];
                setResults(newInfo);
                const action = viewedUsername + " has gained the follower " + yourUsername;
                var dateTime = new Date();
                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                let idStr = idNum.toString();
                addUserFeed(results.Email, viewedUsername, idStr, yourUsername, theirProfilePicture, yourProfilePicture, action, dateTimeEST);
            }
        })
        .catch(error => console.log('error', error));
    }

    const decreaseFollowers = (yourUsername, viewedUsername, yourProfilePicture, theirProfilePicture) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("theirEmail", results.Email);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`http://localhost:5000/api/user/${viewedUsername}/followers/delete`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            if(result.newFollowersInfo) {
                let newInfo = Object.assign({}, results);
                newInfo.Followers = result.newFollowersInfo.Attributes.Followers;
                delete newInfo.FollowersMap[props.currUserInfo.Email];
                setResults(newInfo);
                const action = viewedUsername + " has lost the follower " + yourUsername;
                var dateTime = new Date();
                var dateTimeEST = dateTime.toLocaleString('en-US', {timeZone: 'America/New_York'});
                let idNum = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                let idStr = idNum.toString();
                addUserFeed(results.Email, viewedUsername, idStr, yourUsername, theirProfilePicture, yourProfilePicture, action, dateTimeEST);
            }
        })
        .catch(error => console.log('error', error));
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
    
                    docClient.query(params3, function(err, data) {
                        if (!err) {
                            if (data.Count === 0) {
                                console.log(data);
                            } else {
                                console.log(data, "trying to create");
                                updateUserFeed(yourEmail, yourUsername, idNumber, theirUsername, yourProfilePicture, theirProfilePicture, action, dateTimeEST, props.currUserInfo.Email);
                                for (var item2 in data.Items[0].FollowersMap) {
                                    console.log(item2, "each follower");
                                    updateUserFeed(yourEmail, yourUsername, idNumber, theirUsername, yourProfilePicture, theirProfilePicture, action, dateTimeEST, item2);
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

    function updateUserFeed(yourEmail, yourUsername, idNumber, theirUsername, yourProfilePicture, theirProfilePicture, action, dateTimeEST, item2){
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
                    "theirUsername": theirUsername,
                    "DateOf": dateTimeEST
                }]
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function(err, data) {
            if (err) {
                console.log(err);
            }else {
                console.log("Updated the userfeed of", item2);
            }
        })
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

    function buttonColor(yourUsername, theirUsername, gameID) { 
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
                        return true;
                    })
                }
            }
        })
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
                                {console.log(val.Upvotes, "upvotes", val.Upvotes[props.currUserInfo.Email])}
                                {props.currUser !== username && props.loggedIn &&
                                    <button type="button" style={{backgroundColor: (val.Upvotes[props.currUserInfo.Email] != undefined) ? 'red' : ''}} className="upvote" onClick={() =>addUpvote(props.currUser, username, val.GameID)}></button>
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