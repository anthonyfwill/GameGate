import * as AWS from 'aws-sdk';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserPool from './UserPool';


// var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:'us-east-1:1f1634e0-e85f-4ffe-a509-ecb75c777309'});
// var myConfig = new AWS.Config({
//   credentials: myCredentials, region: 'us-east-1'
// });

// AWS.config.update(myConfig)

// const docClient = new AWS.DynamoDB.DocumentClient()

const Register = (props) => {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const signUp = (email, pw, username) => {
        var params = {
            TableName: "GameGateAccounts",
            KeyConditionExpression: "#email = :email3",
            ExpressionAttributeNames: {
                "#email": "Email"
            },
            ExpressionAttributeValues: {
                ":email3": email
            }
        }
        var canMake = 0;

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
        })

        var params3 = {
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

        props.docClient.query(params3, function(err, data) {
            if (!err) {
                //console.log("no error");
                //console.log(data.Count, "Username entered: " + username);
                if (data.Count === 0) {
                    console.log("Username is available");
                    canMake = canMake + 1;
                    console.log("canMake:", canMake);
                    if (canMake === 2) {
                        UserPool.signUp(email, pw, [], null, (err, data) => {
                            if (err) {
                                console.error(err);
                                setError("Password must be at least 6 characters");
                            } else {
                                console.log(data);
                                var params2 = {
                                    TableName: "GameGateAccounts",
                                    Item: {
                                        "Email": email,
                                        "Password": pw,
                                        "Username": username,
                                        "ProfilePicture": "https://i.imgur.com/y0B5yj6.jpg",
                                        "CurrentG": 0,
                                        "Completed": 0,
                                        "Dropped": 0,
                                        "Planning": 0,
                                        "Followers": 0,
                                        "Following": 0,
                                        "FollowersMap": {},
                                        "FollowingMap": {}
                                    }
                                }
                                props.docClient.put(params2, function(err, data2) {
                                    if (!err) {
                                        console.log("Worked");
                                        /*props.setCurrUserInfo(params2.Item);
                                        props.setCurrUser(username);
                                        props.setLoggedIn(true);
                                        history.push(`/profile/${username}`);*/
                                        history.push(`/login`);

                                    } else {
                                        console.log("Not Worked");
                                        console.log(err);
                                    }
                                })
                            }
                        })
                    }
                } else {
                    console.log("Username is not available");
                    setError('Email or Username are already used');
                }
            } else {
                //console.log(data.Username, "Username entered: " + username);
                console.log(err);
            }
        })
    }

    return (
        <div className="backdrop_container">
            <div className="textbox_container">
                <div>
                    <h1>GameGate Sign Up</h1>
                </div>
                <div><input className="textbox" name="email" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/></div>
                <div><input className="textbox" name="username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/></div>
                <div><input className="textbox" name="pw" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/></div>
                <div><input className="textbox" name="confirm" type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/></div>
                {error && <div>{error}</div>}
                <div><button className="button" type="submit" onClick={() => signUp(email, password, username)}>Sign
            up</button></div>
                <div>
                    <p>Already have an account? Log in <a href="/login">here</a></p>
                </div>
            </div>
        </div>
    );
}
 
export default Register;