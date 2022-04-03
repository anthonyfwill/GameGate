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
    const [error, setError] = useState(null);
    const [pfpEdit, setPfpEdit] = useState(false);
    const [profileUrl, setProfileurl] = useState('');
    const [reviewInfo, setReviewInfo] = useState([]);

    const {username} = useParams();

    useEffect(() => {
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
        })
    }, [])
    //Get all reviews by user
    // var params3 = {
    //     TableName: "Games",
    //     IndexName: "Username-index",
    //     KeyConditionExpression: "#username = :User3",
    //     ExpressionAttributeNames: {
    //         "#username": "Username"
    //     },
    //     ExpressionAttributeValues: {
    //         ":User3": username
    //     }
    // }

    // docClient.query(params3, function(err, data) {
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



    /*var params = {
            TableName: "GameGateAccounts",
            ProjectionExpression: "#gameID, Username, Reviews, Reviews.Review, Reviews.s"
            IndexName: "GameID-Username-index",
            KeyConditionExpression: "#gameID = :User3 and ",
            ExpressionAttributeNames: {
                "#gameID": "GameID"
            },
            ExpressionAttributeValues: {
                ":User3": username
            }
        }

        docClient.query(params3, function(err, data) {
            if (!err) {
                //console.log("no error");
                //console.log(data.Count, "Username entered: " + username);
                if (data.Count === 0) {
                    console.log("Username is available");
                    canMake = canMake + 1;
                } else {
                    console.log("Username is not available");
                }
            } else {
                //console.log(data.Username, "Username entered: " + username);
                console.log(err);
            }
        })*/

        //Add Review
        /*var params5 = {
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

        docClient.query(params5, function(err, data) {
            if (!err) {
                //console.log("no error");
                //console.log(data.Count, "Username entered: " + username);
                if (data.Count === 0) {
                    console.log("Username is available");
                    canMake = canMake + 1;
                } else {
                    console.log("Username is not available");
                    var params4 = {
                        TableName: "GameGateAccounts",
                        Key: {
                            "Email": data.Items[0].Email
                        },
                        UpdateExpression: "set Reviews = list_append(:Reviews)"
                        ExpressionAttributeValues: {
                            ":Reviews": [{Review: review, GameID: gameID, Rating": rating}]
                        },
                        ReturnVaues:"UPDATED_NEW"
                    }
                    docClient.update(params4, function(err, data) {
                        if (!err) {
                            console.log("Worked");
                        } else {
                            console.log("Not Worked");
                        }
                    })
                }
            } else {
                console.log(err);
            }*/

  /* const increaseFollowing = (yourEmail, theirUsername) => { 
        var params = {
            TableName: "Username-index",
            KeyConditionExpression: "#following = :email3",
            ExpressionAttributeNames: {
                "#email": "Email"
            },
            ExpressionAttributeValues: {
                ":email3": email
            },
            UpdateExpression: "set Following = Following + :val",
            ExpressionAttributeValues:{
                ":val":1
            },
            ReturnValues:"UPDATED_NEW"
        }

        docClient.put(params, function(err, data) {
            if (!err) {
                console.log("Worked");
                console.log("Following =", Following);
            } else {
                console.log("Not Worked");
            }
        })
    }

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const decreaseFollowing = (email) => { 
    var params = {
        TableName:"GameGateAccounts",
        Key:{
            "Email": em
        },
        UpdateExpression: "set Following = Following - :val",
        ExpressionAttributeValues:{
            ":val":1
        },
        ReturnValues:"UPDATED_NEW"
    };

    docClient.put(params, function(err, data) {
                if (!err) {
                        console.log("Worked");
console.log("Following =", Following);
                } else {
                        console.log("Not Worked");
                }
    });
}
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const increaseFollowers = (user) => {  
    var params = {
        TableName:"GameGateAccounts",
        Key:{
            "Username": user
        },
        UpdateExpression: "set Followers = Followers + :val",
        ExpressionAttributeValues:{
            ":val":1
        },
        ReturnValues:"UPDATED_NEW"
    };

    docClient.put(params, function(err, data) {
                if (!err) {
                        console.log("Worked");
console.log("Following =", Following);
                } else {
                        console.log("Not Worked");
                }
    });
}

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const decreaseFollowers = (user) => { 
    var params = {
        TableName:"GameGateAccounts",
        Key:{
            "Username": user
        },
        UpdateExpression: "set Follower = Follower - :val",
        ExpressionAttributeValues:{
            ":val":1
        },
        ReturnValues:"UPDATED_NEW"
    };

    docClient.put(params, function(err, data) {
                if (!err) {
                        console.log("Worked");
console.log("Following =", Following);
                } else {
                        console.log("Not Worked");
                }
    });

    const updateRating = (rating, gameIDinfo) => { 
    var params = {
        TableName:"Games",
        Key:{
            "GameID": gameIDinfo
        },
        UpdateExpression: "set GameID =  ((x-1) * oldAverage + (1/x) * :rating)",
        ExpressionAttributeValues:{
            ":rating":rating
        },
        ReturnValues:"UPDATED_NEW"
    };

    docClient.put(params, function(err, data) {
                if (!err) {
                        console.log("Worked");
                } else {
                        console.log("Not Worked");
                }
    });
}*/

    function updateProfilePic() {
        var params = {
            TableName:"GameGateAccounts",
            Key:{
                "Email": results.Email
            },
            UpdateExpression: "set ProfilePicture = :profile",
            ExpressionAttributeValues:{
                ":profile":profileUrl
            },
            ReturnValues:"UPDATED_NEW"
        };
    
        docClient.update(params, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                const newResults = {};
                const someVal = Object.assign(newResults, results);
                newResults.ProfilePicture = profileUrl;
                setResults(newResults);
            }
        });
        setPfpEdit(false);
        setProfileurl('');
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
                        {props.currUser===username && !pfpEdit && <button className="profileBtn" onClick={() => setPfpEdit(true)}>Change Profile Picture</button> }
                        {pfpEdit && <input type="text" value={profileUrl} onChange={(e) => setProfileurl(e.target.value)} placeholder="new profile image url"/>}
                        {pfpEdit && <button className="profileBtn" onClick={updateProfilePic}>Submit</button>}
                    </div>
                    <div>
                        <h2>{username}</h2>
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