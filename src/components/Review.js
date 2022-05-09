import { useParams } from "react-router-dom";
import * as AWS from 'aws-sdk';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Review = (props) => {

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
                <p>Upvotes: {props.UpvotesCount}</p>
            </div>
        </div>
    );
}
 
export default Review;