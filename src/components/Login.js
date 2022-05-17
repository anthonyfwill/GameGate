// import * as AWS from 'aws-sdk';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import UserPool from './UserPool';
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

const Login = (props) => {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');

    const logIn = () => {

        var myHeaders = new Headers();
        myHeaders.append("Content", "application/json");
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("email", email);
        urlencoded.append("password", password);

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
        };

        fetch(`${process.env.REACT_APP_SERVER_LINK}/api/users/login`, requestOptions)
        .then(response => response.json())
        .then(result => {
            props.setCurrUser(result.userInfo.Username);
            props.setCurrUserInfo(result.userInfo);
            localStorage.setItem('user', JSON.stringify(result.userInfo));
            localStorage.setItem('idToken', result.idToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            props.setRefreshToken(result.refreshToken);
            props.setIdToken(result.idToken);
            props.setLoggedIn(true);
            history.push(`/profile/${result.userInfo.Username}`);
        })
        .catch(error => {
            setError('Login Failed');
            setEmail('');
            setPassword('');
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