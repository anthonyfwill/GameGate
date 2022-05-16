import { useParams } from "react-router-dom";
import * as AWS from 'aws-sdk';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Review = (props) => {

    const [upvoted, setUpvoted] = useState(props.upvotes);
    const [upvoteCount, setUpvoteCount] = useState(props.UpvotesCount);

    function addUpvote(yourUsername, theirUsername, gameID) { 
        console.log(yourUsername, theirUsername, gameID);
        // var params2 = {
        //     TableName: "GameGateAccounts",
        //     IndexName: "Username-index",
        //     KeyConditionExpression: "#username = :User3",
        //     ExpressionAttributeNames: {
        //         "#username": "Username"
        //     },
        //     ExpressionAttributeValues: {
        //         ":User3": theirUsername
        //     }
        // }
        // props.docClient.query(params2, function(err, data) {
        //     if(err) {
        //         console.log(err);
        //     } else {
        //         if(data.Count !== 0) {
        //             data.Items.forEach(item => {
        //                 console.log(item);
        //                 console.log(gameID);
        //                 console.log(item.Email);
        //                 console.log(yourUsername);
        //                 var params1 = {
        //                     TableName:"Games",
        //                         Key:{
        //                         "GameID": gameID,
        //                         "Email": item.Email
        //                     },
        //                     UpdateExpression: "SET #uv.#em = :upvote, UpvotesCount = UpvotesCount + :val" ,
        //                     ConditionExpression: "attribute_not_exists(#uv.#em.Username)",
        //                     ExpressionAttributeNames: {
        //                         "#uv": "Upvotes",
        //                         "#em": props.currUserInfo.Email
        //                     },
        //                     ExpressionAttributeValues:{
        //                         ":upvote": {
        //                             "Username": yourUsername,
        //                         },
        //                         ":val": 1,
        //                     },
        //                     ReturnValues:"UPDATED_NEW"
        //                 };
        //                 props.docClient.update(params1, function(err, data) {
        //                     if (err) {
        //                         console.log(err);
        //                         // removeUpvote(yourUsername, theirUsername, gameID);
        //                     } else {
        //                         setUpvoted(true);
        //                         setUpvoteCount(upvoteCount + 1);
        //                         console.log(data);
        //                     }
        //                 });
        //             })
        //         }
        //     }
        // })
        console.log("upvote added");
    }

    function removeUpvote(yourUsername, theirUsername, gameID) { 
        // console.log("remove upvote");
        // var params2 = {
        //     TableName: "GameGateAccounts",
        //     IndexName: "Username-index",
        //     KeyConditionExpression: "#username = :User3",
        //     ExpressionAttributeNames: {
        //         "#username": "Username"
        //     },
        //     ExpressionAttributeValues: {
        //         ":User3": theirUsername
        //     }
        // }
    
        // props.docClient.query(params2, function(err, data) {
        //     if (!err) {
        //         if (data.Count === 0) {
        //             console.log(data);
        //         } else {
        //             console.log(data);
        //             data.Items.forEach(item => {
        //                 console.log(item, "itemmmmm");
        //                 var params1 = {
        //                     TableName:"Games",
        //                         Key:{
        //                         "GameID": gameID,
        //                         "Email": item.Email
        //                     },
        //                     UpdateExpression: "REMOVE #uv.#em SET UpvotesCount = UpvotesCount - :val" ,
        //                     ConditionExpression: "attribute_exists(#uv.#em.Username)",
        //                     ExpressionAttributeNames: {
        //                         "#uv": "Upvotes",
        //                         "#em": props.currUserInfo.Email
        //                     },
        //                     ExpressionAttributeValues:{
        //                         ":val": 1,
        //                     },
        //                     ReturnValues:"UPDATED_NEW"
        //                 };
        //                 props.docClient.update(params1, function(err, data) {
        //                     if (err) {
        //                         console.log(err);
        //                     } else {
        //                         setUpvoted(false);
        //                         console.log(data)
        //                     }
        //                 });
        //             })
        //         }
        //     }
        // })
        console.log("upvote removed");
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
                <p>Upvotes: {props.UpvotesCount}</p>
                {!upvoted && <button type="button" className="upvote" onClick={() => addUpvote(props.yourUsername, props.username, props.gameID)}></button>}
                {upvoted && <button  style={{backgroundColor: 'red'}} className="upvote" type="button" onClick={() => removeUpvote(props.yourUsername, props.username, props.gameID)}></button>}
            </div>
        </div>
    );
}
 
export default Review;