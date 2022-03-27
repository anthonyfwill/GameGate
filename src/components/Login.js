const Login = () => {
    return (
        <div className="backdrop_container">
        <div className="textbox_container">
            <div>
                <h1>GameGate Login</h1>
            </div>
            <div><input className="textbox" name="email" type="text" placeholder="Email"/></div>
            <div><input className="textbox" name="pw" type="password" placeholder="Password"/></div>
            {/* onclick="confirmLogin(document.getElementsByName('email'), document.getElementsByName('pw'))" */}
            <div><button className="button" type="submit">Login</button>
            </div>
            <div>
                <p>No account? Register <a href="/register">here</a></p>
            </div>
        </div>
    </div>
    );
}
 
export default Login;