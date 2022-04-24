import Review from "./Review";
import { useParams } from "react-router-dom";
import * as AWS from 'aws-sdk';
import { useEffect, useState } from "react";

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

    const {username} = useParams();

    useEffect(() => {
        if(!requesting && (results === null || results.Username !== username)) {
            // console.log(results);
            // console.log(results, username);
            setRequesting(true);
            var params = {
                TableName: "GameGateAccounts",
                IndexName: "Username-index",
                KeyConditionExpression: "#username = :User3",
                ExpressionAttributeNames: {
                    "#username": "Username"
                },
                ExpressionAttributeValues: {
                    ":User3": username
                }
            }
            
            docClient.query(params, function(err, data) {
                if(err) {
                    console.log('Could not retrieve information for that user');
                    setError('Could not retrieve information for that user');
                    setPending(false);
                } else if(data.Count === 0) {
                    console.log('User does not exist');
                    setError('User does not exist');
                    setPending(false);
                }
                else {
                    setResults(data.Items[0]);
                    setPending(false);
                    setError(null);
                }
            })

            var params3 = {
                TableName: "Games",
                IndexName: "Username-index",
                KeyConditionExpression: "#username = :User3",
                ExpressionAttributeNames: {
                    "#username": "Username"
                },
                ExpressionAttributeValues: {
                    ":User3": username
                }
            }
        
            docClient.query(params3, function(err, data) {
                if (!err) {
                    let newReviewInfo = [];
                    if (data.Count === 0) {
                        console.log(data);
                    } else {
                        console.log(data);
                    }
                    for(let i = 0; i < data.Count; i++) {
                        newReviewInfo.push(data.Items[i]);
                    }
                    setReviewInfo(newReviewInfo);
                } else {
                    console.log(err);
                }
                setRequesting(false);
            })
        }
        console.log(following);
        if(props.currUserInfo) {
            checkFollowing();
        }
    }, [username, following, props.completion])

    const checkFollowing = () => {
        // console.log(props.currUserInfo);
        for(let i of props.currUserInfo.FollowingList) {
            if(i === username) {
                setFollowing(true);
            }
        }
        // console.log(props.currUserInfo.FollowingList);
    }

     const increaseFollowing = (yourUsername, theirUsername) => { 
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
                                "Email": item.Email,
                            },
                            UpdateExpression: "ADD #fl :userViewedNameList SET Following = Following + :val",
                            ConditionExpression: "not contains(#fl, :userViewedNameString)",
                            ExpressionAttributeNames: {
                                "#fl": "FollowingList"
                            },
                            ExpressionAttributeValues:{
                                ":userViewedNameList": docClient.createSet([theirUsername]),
                                ":userViewedNameString": theirUsername,
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
                                newInfo.FollowingList = data.Attributes.FollowingList;
                                props.setCurrUserInfo(newInfo);
                                localStorage.setItem('user', JSON.stringify(newInfo));
                                console.log(newInfo);
                                console.log("Increased the following count of", username);
                            }
                        });
                    })
                }
            }
        })
        setFollowing(true);
        increaseFollowers(yourUsername, theirUsername);
    }



    const decreaseFollowing = (yourUsername, theirUsername) => { 
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
                                "Email": item.Email,
                            },
                            UpdateExpression: "DELETE #fl :userViewedNameList SET Following = Following - :val",
                            ConditionExpression: "contains(#fl, :userViewedNameString)",
                            ExpressionAttributeNames: {
                                "#fl": "FollowingList"
                            },
                            ExpressionAttributeValues:{
                                ":userViewedNameList": docClient.createSet([theirUsername]),
                                ":userViewedNameString": theirUsername,
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
                                console.log("Decreased the following count of", username);
                            }
                        });
                    })
                }
            }
        })
        decreaseFollowers(yourUsername, theirUsername);
    }

     const increaseFollowers = (yourUsername, viewedUsername) => {  
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
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "ADD #fl :yourUsernameList SET Followers = Followers + :val",
                            ConditionExpression: "not contains(#fl, :yourUsernameString)",
                            ExpressionAttributeNames: {
                                "#fl": "FollowersList"
                            },
                            ExpressionAttributeValues:{
                                ":yourUsernameList": docClient.createSet([yourUsername]),
                                ":yourUsernameString": yourUsername,
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
                            }
                        });
                    })
                }
            }
        })
    }

    
    const decreaseFollowers = (yourUsername, viewedUsername) => { 
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
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"GameGateAccounts",
                                Key:{
                                "Email": item.Email,
                            },
                            UpdateExpression: "DELETE #fl :yourUsernameList SET Followers = Followers - :val",
                            ConditionExpression: "contains(#fl, :yourUsernameString)",
                            ExpressionAttributeNames: {
                                "#fl": "FollowersList"
                            },
                            ExpressionAttributeValues:{
                                ":yourUsernameList": docClient.createSet([yourUsername]),
                                ":yourUsernameString": yourUsername,
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
                            }
                        });
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
                        {!following && props.loggedIn && username != props.currUser && <div><button className="list_entry" type="submit" onClick={() => increaseFollowing(props.currUser, username)}>Follow</button></div> }
                        {following && props.loggedIn && username != props.currUser && <div><button className="list_entry" type="submit" onClick={() => console.log('unfollow')}>Unfollow</button></div> }
                    </div>
                    <div className="game-stats">
                        <div className="individual-stat-container">
                            <h2>{results.Current}</h2>
                            <p>Current</p>
                        </div>
                        <div className="individual-stat-container">
                            <h2>{results.Completed}</h2>
                            <p>Completed</p>
                        </div>
                        <div className="individual-stat-container">
                            <h2>{results.Dropped}</h2>
                            <p>Dropped</p>
                        </div>
                        <div className="individual-stat-container">
                            <h2>{results.Planning}</h2>
                            <p>Planning</p>
                        </div>
                    </div>
                    <div className="follow-stats">
                        <div className="individual-stat-container">
                            <h2>{results.Followers}</h2>
                            <p>Followers</p>
                        </div>
                        <div className="individual-stat-container">
                            <h2>{results.Following}</h2>
                            <p>Following</p>
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
                                <Review gameImage={val.GameImage} name={val.GameName} content={val.Review} score={val.Rating} id={val.GameID} key={val.GameName}/>
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