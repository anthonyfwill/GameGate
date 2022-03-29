import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";

const GameDetails = (props) => {
    const { id } = useParams();

    const { results, isPending, error} = useFetch(id);
    const [reviewOpened, setReviewOpened] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewScore, setReviewScore] = useState('');

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

    function addPlanning(e) {
        if(e.target.textContent === 'Add to planning') {
            e.target.textContent = 'Planning'
            //add code to update planning count for user and add game id to list of games user is planning on playing
        } else {
            e.target.textContent = 'Add to planning'
            //decrement planning count for user and remove game id from list of games user is planning to play
        }
    }

    function updateReviews() {
        setReviewOpened(false);
        setReviewScore('');
        setReviewText('');
        //update the list of reviews for game and user tables
    }

    return (
            <div className="new-parent">
                {isPending && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {results && 
                <div className="new-child">
                    <div className="coverTitleContainer">
                        <img className="coverArt" src={`https:${results[0].cover.url}`} alt="Game cover art"/>
                        {props.loggedIn && <button type="button" className="list_entry" onClick={(e) => addPlanning(e)}>Add to planning</button>}
                    </div>
                    <hr className="rounded"/>
                    <div className="gameDescrip">
                        <h1>{results[0].name + ' (' + results[0].first_release_date + ')'}</h1>
                        <p>Platforms: {combineAll(results[0].platforms)}</p>
                        <p>{results[0].summary}</p>
                        <p>Genres: {combineAll(results[0].genres)}</p>
                    </div>
                </div> }
                <div className="game-reviews">
                    <h1>Reviews</h1>
                    {props.loggedIn && !reviewOpened && <button className="reviewBtn" onClick={() => setReviewOpened(true)}>Write a review</button>}
                    {reviewOpened &&
                    <div className="reviewBox">
                    <textarea id="gamereview" placeholder="Write a review" name="review" rows="8" cols="90" value={reviewText} onChange={(e) => setReviewText(e.value)}></textarea>
                        <div className="scoreandtext"></div>
                        {/* <input type="number" id="scorereview" name="quantity" min="1" max="10"></input> */}
                        <textarea id="scorereview" maxlength="2" placeholder="Score / 10" pattern="\d$" value={reviewScore} onChange={(e) => setReviewScore(e.value)}></textarea>
                        <div>
                            <input className="reviewBtn" type="submit" value="Publish" onClick={updateReviews}/>
                        </div>
                    </div> }
                </div>
            </div>
    );
}
 
export default GameDetails;