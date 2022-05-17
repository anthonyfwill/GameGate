import { useParams } from "react-router-dom";
import * as AWS from 'aws-sdk';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Review = (props) => {

    const [upvoted, setUpvoted] = useState(props.upvotes);
    const [upvoteCount, setUpvoteCount] = useState(props.UpvotesCount);

    function addUpvote(yourUsername, theirUsername, gameID) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("username", yourUsername);
        urlencoded.append("theirEmail", props.reviewEmail);
        urlencoded.append("gameID", gameID);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`${process.env.REACT_APP_SERVER_LINK}/api/reviews/upvote`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            setUpvoted(true);
            setUpvoteCount(upvoteCount + 1);
        })
        .catch(error => error);
    }

    function removeUpvote(yourUsername, theirUsername, gameID) { 
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("idToken", props.idToken);
        urlencoded.append("refreshToken", props.refreshToken);
        urlencoded.append("email", props.currUserInfo.Email);
        urlencoded.append("username", yourUsername);
        urlencoded.append("theirEmail", props.reviewEmail);
        urlencoded.append("gameID", gameID);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`${process.env.REACT_APP_SERVER_LINK}/api/reviews/downvote`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if(result.newId) {
                localStorage.setItem('idToken', result.idToken);
                props.setIdToken(result.idToken);
            }
            setUpvoted(false);
            setUpvoteCount(upvoteCount - 1);
        })
        .catch(error => error);
    }

    return (
        <div className="review-container">
            <div className="single-review">
                <div>
                    <Link to={`/game/${props.id}`}>
                        {props.gameImage && <img src={`http:${props.gameImage}`} alt={props.name} />}
                    </Link>
                    {props.name && <h3>{props.name}</h3> }
                </div>
                <div>
                    <Link to={`../profile/${props.username}`}>
                        {props.profPic && <img src={props.profPic} alt={props.name}/>}
                    </Link>
                    {props.username && <h3>{props.username}</h3>}
                </div>
                <p className="score-color">Score: {props.score}/10</p>
                <p>{props.content}</p>
                <p>Upvotes: {upvoteCount}</p>
                {props.username && props.username !== props.yourUsername && !upvoted && <button type="button" className="upvote" onClick={() => addUpvote(props.yourUsername, props.username, props.gameID)}></button>}
                {props.username && props.username !== props.yourUsername && upvoted && <button className="downvote" type="button" onClick={() => removeUpvote(props.yourUsername, props.username, props.gameID)}></button>}
                {props.username2 !== props.username && props.username2 !== props.yourUsername && !upvoted && <button type="button" className="upvote" onClick={() => addUpvote(props.yourUsername, props.username2, props.gameId)}></button>}
                {props.username2 !== props.username && props.username2 !== props.yourUsername && upvoted && <button className="downvote" type="button" onClick={() => removeUpvote(props.yourUsername, props.username2, props.gameId)}></button>}
            </div>
        </div>
    );
}
 
export default Review;