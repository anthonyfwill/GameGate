import { useParams } from "react-router-dom";
import * as AWS from 'aws-sdk';
import { useState } from "react";

const Settings = (props) => {
    const [pfpEdit, setPfpEdit] = useState(false);
    const [profileUrl, setProfileurl] = useState('');
  
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
                console.log(err);
            } else {
                const newResults = {};
                const someVal = Object.assign(newResults, props.currUserInfo);
                newResults.ProfilePicture = profileUrl;
                props.setCurrUserInfo(newResults);
            }
        });

        var params2 = {
            TableName: "Games",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": props.currUser
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
                                "GameID": item.GameID,
                                "Username": props.currUser
                            },
                            UpdateExpression: "set ProfilePic = :profile",
                            ExpressionAttributeValues:{
                                ":profile":profileUrl
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("Updated the profile pic of all reviews by", props.currUser);
                            }
                        });
                    })
                }

            } else {
                console.log(err);
            }
        })
        
        setPfpEdit(false);
        setProfileurl('');
        
      //Update Username
    /*function changeUsername(oldUsername, newUsername) {
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": oldUsername
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
                                "Email": item.Email
                            },
                            UpdateExpression: "set Username = :username",
                            ExpressionAttributeValues:{
                                ":username":newUsername
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data);
                                console.log("Updated the profile pic of all reviews by", username);
                            }
                        });
                    })
                }
    function changePassword(oldPassword, newPassword) {
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": oldUsername
            }
        }
    
        docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        if (item.Password === oldPassword) {
                            var params1 = {
                                TableName:"GameGateAccounts",
                                    Key:{
                                    "Email": item.Email
                                },
                                UpdateExpression: "set Password = :password",
                                ExpressionAttributeValues:{
                                    ":password":newPassword
                                },
                                ReturnValues:"UPDATED_NEW"
                            };
                            console.log(item);
                            docClient.update(params1, function(err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(data);
                                    console.log("Updated the profile pic of all reviews by", username);
                                }
                            });
                        }
                    })
                }*/

//Update Username of all Reviews
var params2 = {
            TableName: "Games",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": oldUsername
            }
        }
    
        docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params2 = {
                           TableName: "Games",
                            Item: {
                              "GameID": item.id,
                			  "GameName": item.gameName,
                			  "Username": newUsername,
                			  "Review": item.reviewText,
                			  "Rating": item.reviewScore,
                			  "GameImage": item.gameImg,
                			  "ProfilePic": item.profPic
                            }
                        }
                            props.docClient.put(params2, function(err, data2) {
                               if (!err) {
                                   console.log("Worked");
                                    props.setCurrUserInfo(params2.Item);
                                    props.setCurrUser(username);
                                    props.setLoggedIn(true);
                                    history.push(`/profile/${username}`);
                                    //history.push(`/login`);

                               } else {
                                    console.log("Not Worked");
                                    console.log(err);
                               }
                            })
                     })
        }
    }*/
}
    return (
        <div className = 'feed_container'>
        <div className = 'posts_container'>
        <div className='image-section'>
                        <img id="pfp" src={props.currUserInfo.ProfilePicture}/>
                        {!props.pfpEdit && <button className="profileBtn" onClick={() => setPfpEdit(true)}>Change Profile Picture</button> }
                        {pfpEdit && <input type="text" value={profileUrl} onChange={(e) => setProfileurl(e.target.value)} placeholder="new profile image url"/>}
                        {pfpEdit && <button className="profileBtn" onClick={updateProfilePic}>Submit</button>}
                    </div>
        </div>
      </div>
    );

}
 
export default Settings;
