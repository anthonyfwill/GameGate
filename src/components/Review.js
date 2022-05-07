import { useParams } from "react-router-dom";
import * as AWS from 'aws-sdk';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



const Review = (props) => {


    const checkUpvote = async () => {

    }

    function addUpvote(yourUsername, theirUsername, gameID) { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": theirUsername
            }
        }
        console.log(yourUsername, theirUsername, gameID);
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        /*var params1 = {
                            TableName:"Games",
                                Key:{
                                "GameID": gameID,
                                "Email": item.email
                            },
                            UpdateExpression: "SET #uv.#em = :upvote, UpvotesCount = UpvotesCount + :val" ,
                            ConditionExpression: "attribute_not_exists(#uv.#em.Username)",
                            ExpressionAttributeNames: {
                                "#uv": "Upvotes",
                                "#em": props.Email
                            },
                            ExpressionAttributeValues:{
                                ":upvote": {
                                    "Username": yourUsername,
                                    "ProfilePicture": item.ProfilePic,
                                },
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        console.log(item);
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                                removeUpvote(yourUsername, theirUsername, gameID);
                            } else {
                                console.log(data);
                            }
                        });*/
                    })
                }
            }
        })
        console.log("upvote added");
    }

    function removeUpvote(yourUsername, theirUsername, gameID) { 
        var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": yourUsername
            }
        }
    
        props.docClient.query(params2, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    console.log(data);
                    data.Items.forEach(item => {
                        var params1 = {
                            TableName:"Games",
                                Key:{
                                "GameID": gameID,
                                "Username": theirUsername
                            },
                            UpdateExpression: "REMOVE #uv.#em SET UpvotesCount = UpvotesCount - :val" ,
                            ConditionExpression: "attribute_exists(#uv.#em.GameName)",
                            ExpressionAttributeNames: {
                                "#uv": "Upvotes",
                                "#em": item.Email
                            },
                            ExpressionAttributeValues:{
                                ":val": 1,
                            },
                            ReturnValues:"UPDATED_NEW"
                        };
                        props.docClient.update(params1, function(err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(data)
                            }
                        });
                    })
                }
            }
        })
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
                {props.yourUsername !== props.username2 &&
                    <button type="button" className="list_entry" onClick={() =>addUpvote(props.yourUsername, props.username2, props.gameID)}>Upvotes</button>
                }
            </div>
        </div>
    );
}
 
export default Review;