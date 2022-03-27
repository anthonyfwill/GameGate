const Register = () => {
    // AWS.config.region = 'us-east-1'; // Region
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //     IdentityPoolId: 'us-east-1:1f1634e0-e85f-4ffe-a509-ecb75c777309',
    // });

    // var docClient = new AWS.DynamoDB.DocumentClient();

    // function confirmPassword(email, username, pw) {
    //     var params = {
    //         TableName: "GameGateAccounts",
    //         Item: {
    //             "Email": email[0].value,
    //             "Password": pw[0].value,
    //             "Username": username[0].value,
    //         }
    //     };
    //     var em = email[0].value;
    //     var user = username[0].value;
    //     var pr = pw[0].value;
    //     console.log(em, user, pr);
    //     docClient.put(params, function(err, data) {
    //         if (!err) {
    //             console.log("Worked");
    //             window.location.href = "profilepage.html";
    //         } else {
    //             console.log("Not Worked");
    //         }
    //     });
    // }

    return (
        <div className="backdrop_container">
            <div className="textbox_container">
                <div>
                    <h1>GameGate Sign Up</h1>
                </div>
                <div><input className="textbox" name="email" type="text" placeholder="Email"/></div>
                <div><input className="textbox" name="username" type="text" placeholder="Username"/></div>
                <div><input className="textbox" name="pw" type="password" placeholder="Password"/></div>
                <div><input className="textbox" name="confirm" type="password" placeholder="Confirm password"/></div>
                {/* onClick="confirmPassword(document.getElementsByName('email'), document.getElementsByName('username'), document.getElementsByName('pw'))" */}
                <div><button className="button" type="submit">Sign
            up</button></div>
                <div>
                    <p>Already have an account? Log in <a href="/login">here</a></p>
                </div>
            </div>
    </div>
    );
}
 
export default Register;