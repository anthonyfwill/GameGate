import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";

const GameDetails = () => {
    const { id } = useParams();

    const { results, isPending, error} = useFetch(id);

    function combineAll(array) {
        const output = [];
        for(let i = 0; i < array.length; i++) {
            output.push(array[i].name);
        }
        return output.join(', ');
    }
    //All reviews for a game (Just have to loop through game api and with the parameter of the gameID which is "gameID" in this function)
    /*var params2 = {
            TableName: "GameGateAccounts",
            IndexName: "GameID-Username-index",
            KeyConditionExpression: "#gameID = :gameID3",
            ExpressionAttributeNames: {
                "#gameID": "GameID"
            },
            ExpressionAttributeValues: {
                ":gameID3": gameID
            }
        }

        docClient.query(params3, function(err, data) {
            if (!err) {
                if (data.Count === 0) {
                    console.log(data);
                } else {
                    data.Items.forEach(function(item) {
                        console.log("Review:", item.Reviews)
                    })
                }
            } else {
                console.log(err);
            }
        })*/

    return (
            <div className="new-parent">
                {isPending && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {results && 
                <div className="new-child">
                    <div className="coverTitleContainer">
                        <img className="coverArt" src={`https:${results[0].cover.url}`} alt="Game cover art"/>
                    </div>
                    <hr className="rounded"/>
                    <div className="gameDescrip">
                        <h1>{results[0].name + ' (' + results[0].first_release_date + ')'}</h1>
                        <p>Platforms: {combineAll(results[0].platforms)}</p>
                        <p>{results[0].summary}</p>
                        <p>Genres: {combineAll(results[0].genres)}</p>
                    </div>
                </div> }
            </div>
    );
}
 
export default GameDetails;