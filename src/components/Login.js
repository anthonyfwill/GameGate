import * as AWS from 'aws-sdk';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:'us-east-1:1f1634e0-e85f-4ffe-a509-ecb75c777309'});
var myConfig = new AWS.Config({
  credentials: myCredentials, region: 'us-east-1'
});

AWS.config.update(myConfig)

const docClient = new AWS.DynamoDB.DocumentClient()

const Login = (props) => {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');

    const logIn = () => {
        var params = {
            TableName: "GameGateAccounts",
            Key: {
                "Email": email,
            }
        }
        docClient.scan(params, function (err, data) {
            if (!err) {
                // console.log(data);
            }
        }) 
        docClient.get(params, function(err, data) {
            if (!err && Object.keys(data).length !== 0) {
                if (password === data.Item.Password) {
                        console.log("match");
                        props.setLoggedIn(true);
                        props.setCurrUser(data.Item.Username);
                        history.push(`/profile/${data.Item.Username}`);
                } else {
                    console.log("Wrong password or email");
                    setError('Incorrect Login Credentials');
                    setEmail('');
                    setPassword('');
                }
            } else {
                setError('Incorrect Login Credentials');
                setEmail('');
                setPassword('');
                console.log(err);
            }
        })
    }

    return (
        <div className="backdrop_container">
            <div className="textbox_container">
                <div>
                    <h1>GameGate Login</h1>
                </div>
                <div><input className="textbox" name="email" type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/></div>
                <div><input className="textbox" name="pw" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/></div>
                {error && <div>{error}</div>}
                <div><button className="button" type="submit" onClick={logIn}>Login</button>
                </div>
                <div>
                    <p>No account? Register <a href="/register">here</a></p>
                </div>
            </div>
        </div>
    );
}
 
export default Login;