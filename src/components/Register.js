import * as AWS from 'aws-sdk';
import { useState } from 'react';

var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:'us-east-1:1f1634e0-e85f-4ffe-a509-ecb75c777309'});
var myConfig = new AWS.Config({
  credentials: myCredentials, region: 'us-east-1'
});

AWS.config.update(myConfig)

const docClient = new AWS.DynamoDB.DocumentClient()

const Register = () => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const signUp = (email, pw, username) => {
        var params = {
            TableName: "GameGateAccounts",
            Item: {
                "Email": email,
                    "Password": pw,
                    "Username": username,
            }
        }
        
        var em = email;
        var user = username;
        var pr = pw;
        console.log(em, user, pr);
        docClient.put(params, function(err, data) {
            if (!err) {
                console.log("Worked");
                    // window.location.href = "profilepage.html";
            } else {
                    console.log("Not Worked");
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