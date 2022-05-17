import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Register = (props) => {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const signUp = (email, pw, username) => {
        if(password !== confirmPassword) {
            setError('Passwords not equal');
        } else if(!email || !pw || !username) {
            setError('One of more fields is empty');
        } else {
            var myHeaders = new Headers();
            myHeaders.append("Content", "application/json");
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("email", email);
            urlencoded.append("pw", pw);
            urlencoded.append("username", username);

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
            };

            fetch(`${process.env.REACT_APP_SERVER_LINK}/api/users`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.success)  {
                    history.push(`/login`);
                } else {
                    setError('Registration failed');
                }
            })
            .catch(error => {
                setError("Username or email already used");
            })
        }
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