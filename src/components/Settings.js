import { useParams } from "react-router-dom";
import * as AWS from 'aws-sdk';
import { useState, useEffect } from "react";

const Settings = (props) => {
    const [pfpEdit, setPfpEdit] = useState(false);
    const [usernameEdit, setUsernameEdit] = useState(false);
    const [currentPfp, setCurrentPfp] = useState(null);
    const [currentUsername, setCurrentUsername] = useState(null);
    const [profileUrl, setProfileurl] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if(props.completion) {
            setCurrentPfp(props.currUserInfo.ProfilePicture);
            setCurrentUsername(props.currUserInfo.Username);
        }
    }, [props.completion])
  
    function updateProfilePic() {
        var params = {
            TableName:"GameGateAccounts",
            Key:{
                "Email": props.currUserInfo.Email
            },
            UpdateExpression: "set ProfilePicture = :profile",
            ExpressionAttributeValues:{
                ":profile":profileUrl
            },
            ReturnValues:"UPDATED_NEW"
        };

        props.docClient.update(params, function(err, data) {
            if (err) {
                return err;
            } else {
                const newResults = {};
                const someVal = Object.assign(newResults, props.currUserInfo);
                newResults.ProfilePicture = profileUrl;
                props.setCurrUserInfo(newResults);
                localStorage.setItem('user', JSON.stringify(newResults));
            }
        });

        var params2 = {
            TableName: "Games",
            IndexName: "Email-GameID-index",
            KeyConditionExpression: "#email = :Email3",
            ExpressionAttributeNames: {
                "#email": "Email"
            },
            ExpressionAttributeValues: {
                ":Email3": props.currUserInfo.Email
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    // console.log(data);
                } else {
                    // console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"Games",
                                Key:{
                                "GameID": item.GameID,
                                "Email": props.currUserInfo.Email
                            },
                            UpdateExpression: "set ProfilePic = :profile",
                            ExpressionAttributeValues:{
                                ":profile":profileUrl
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        // console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                // console.log(err);
                            } else {
                                // console.log(data);
                                // console.log("Updated the profile pic of all reviews by", props.currUser);
                            }
                        });
                    })
                }

            } else {
                // console.log(err);
            }
        })

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
                    // console.log(data);
                } else {
                    // console.log(data);
                    // console.log(data.Items[0].FollowingMap, "FollowingMap");
                    for (var item2 in data.Items[0].FollowingMap) {
                        // console.log(item2, "each following");
                        profilePicFollowersMap(item2);
                    }
                    for (var item2 in data.Items[0].FollowersMap) {
                        // console.log(item2, "each following");
                        profilePicFollowingMap(item2);
                    }
                }

            } else {
                // console.log(err);
            }
        })
        
        setPfpEdit(false);
        setProfileurl('');
}

    function profilePicFollowersMap(item2){
        var params = {               
            TableName:"GameGateAccounts",            
            Key:{
                "Email": item2
            },
            UpdateExpression: "SET #fl.#em.#p = :profile",
            ExpressionAttributeNames: {
                "#fl": "FollowersMap",
                "#em": props.currUserInfo.Email,
                "#p": "ProfilePicture"
            },
            ExpressionAttributeValues:{
                ":profile":profileUrl
            },
            ReturnValues:"UPDATED_NEW"
        };

        props.docClient.update(params, function(err, data) {
            if (err) {
                // console.log(err);
            }else {
                // console.log("Updated your profile picture for the followers map of", item2);
            }
        })

    }

    function profilePicFollowingMap(item2){
        var params = {               
            TableName:"GameGateAccounts",            
            Key:{
                "Email": item2
            },
            UpdateExpression: "SET #fl.#em.#p = :profile",
            ExpressionAttributeNames: {
                "#fl": "FollowingMap",
                "#em": props.currUserInfo.Email,
                "#p": "ProfilePicture"
            },
            ExpressionAttributeValues:{
                ":profile":profileUrl
            },
            ReturnValues:"UPDATED_NEW"
        };

        props.docClient.update(params, function(err, data) {
            if (err) {
                // console.log(err);
            }else {
                // console.log("Updated your profile picture for the following map of", item2);
            }
        })
    }

function updateUsername() {
        var params5 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": newUsername
            }
        }
        props.docClient.query(params5, function(err, data){
            if(!err) {
                if (data.Count > 0) {
                    setError("Username taken, pick a different username");
                } else if (data.Count === 0) {
                    var params = {
                        TableName:"GameGateAccounts",
                        Key:{
                            "Email": props.currUserInfo.Email
                        },
                        UpdateExpression: "set Username = :username",
                        ExpressionAttributeValues:{
                            ":username": newUsername
                        },
                        ReturnValues:"UPDATED_NEW"
                    };

                    props.docClient.update(params, function(err, data) {
                        if (err) {
                            // console.log(err);
                        } else {
                            setError(null);
                            const newResults = {};
                            const someVal = Object.assign(newResults, props.currUserInfo);
                            newResults.Username = newUsername;
                            props.setCurrUser(newUsername);
                            props.setCurrUserInfo(newResults);
                            localStorage.setItem('user', JSON.stringify(newResults));
                        }
                    });

                    var params2 = {
                        TableName: "Games",
                        IndexName: "Email-GameID-index",
                        KeyConditionExpression: "#email = :Email3",
                        ExpressionAttributeNames: {
                            "#email": "Email"
                        },
                        ExpressionAttributeValues: {
                            ":Email3": props.currUserInfo.Email
                        }
                    }
                
                    props.docClient.query(params2, function(err, data) {
                        if (!err) {
                            if (data.Count === 0) {
                                // console.log(data);
                            } else {
                                // console.log(data);
                                data.Items.forEach(item => {
                                    //console.log(item.GameID);
                                    //console.log(props.currUserInfo.Email);
                                    var params1 = {
                                        TableName:"Games",
                                            Key:{
                                            "GameID": item.GameID,
                                            "Email": props.currUserInfo.Email
                                        },
                                        UpdateExpression: "set Username = :username",
                                        ExpressionAttributeValues:{
                                            ":username": newUsername
                                        },
                                        ReturnValues:"UPDATED_NEW"
                                    };
                                    // console.log(item);
                                    props.docClient.update(params1, function(err, data) {
                                        if (err) {
                                            // console.log(err);
                                        } else {
                                            // console.log("Updated the username of all reviews by", props.currUser);
                                        }
                                    });
                                })
                            }

                        } else {
                            // console.log(err);
                        }
                    })

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
                                // console.log(data);
                            } else {
                                // console.log(data);
                                // console.log(data.Items[0].FollowingMap, "FollowingMap");
                                for (var item2 in data.Items[0].FollowingMap) {
                                    // console.log(item2, "each following");
                                    usernameFollowersMap(item2);
                                }
                                for (var item2 in data.Items[0].FollowersMap) {
                                    // console.log(item2, "each following");
                                    usernameFollowingMap(item2);
                                }
                            }

                        } else {
                            // console.log(err);
                        }
                    })
                    setUsernameEdit(false);
                    setNewUsername('');
                }
            }
        })        
    }

    function usernameFollowersMap(item2){
        var params = {               
            TableName:"GameGateAccounts",            
            Key:{
                "Email": item2
            },
            UpdateExpression: "SET #fl.#em.#userN = :username",
            ExpressionAttributeNames: {
                "#fl": "FollowersMap",
                "#em": props.currUserInfo.Email,
                "#userN": "Username"
            },
            ExpressionAttributeValues:{
                ":username":newUsername
            },
            ReturnValues:"UPDATED_NEW"
        };

        props.docClient.update(params, function(err, data) {
            if (err) {
                // console.log(err);
            }else {
                // console.log("Updated your username for the followers map of", item2);
            }
        })

    }

    function usernameFollowingMap(item2){
        var params = {               
            TableName:"GameGateAccounts",            
            Key:{
                "Email": item2
            },
            UpdateExpression: "SET #fl.#em.#userN = :username",
            ExpressionAttributeNames: {
                "#fl": "FollowingMap",
                "#em": props.currUserInfo.Email,
                "#userN": "Username"
            },
            ExpressionAttributeValues:{
                ":username":newUsername
            },
            ReturnValues:"UPDATED_NEW"
        };

        props.docClient.update(params, function(err, data) {
            if (err) {
                // console.log(err);
            }else {
                // console.log("Updated your username for the following map of", item2);
            }
        })
    }


    return (
        <div className = 'feed_container'>
        <div className = 'posts_container'>
        <div className='image-section'>
            {currentPfp && <img id="pfp" src={props.currUserInfo.ProfilePicture}/>}
            {!pfpEdit && <button className="profileBtn" onClick={() => setPfpEdit(true)}>Change Profile Picture</button> }
            {pfpEdit && <input type="text" value={profileUrl} onChange={(e) => setProfileurl(e.target.value)} placeholder="new profile image url"/>}
            {pfpEdit && <button className="profileBtn" onClick={updateProfilePic}>Submit</button>}
        </div>
        <div className='image-section'>
            {currentUsername && <p>{props.currUserInfo.Username}</p>}
            {!usernameEdit && <button className="profileBtn" onClick={() => setUsernameEdit(true)}>Change Username</button> }
            {usernameEdit && <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="new username"/>}
            {error && <p>{error}</p>}
            {usernameEdit && <button className="profileBtn" onClick={updateUsername}>Submit</button>}
        </div>
        </div>
      </div>
    );

}
 
export default Settings;
