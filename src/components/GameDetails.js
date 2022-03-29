import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";

const GameDetails = (props) => {
    const { id } = useParams();

    const { results, isPending, error} = useFetch(id);

    function combineAll(array) {
        const output = [];
        for(let i = 0; i < array.length; i++) {
            output.push(array[i].name);
        }
        return output.join(', ');
    }

    // function addPlanning(e) {
    //     if(e.target.textContent === 'Add to planning') {
    //         e.target.textContent = 'Planning'
    //     } else {
    //         e.target.textContent = 'Add to planning'
    //     }
    // }

    return (
            <div className="new-parent">
                {isPending && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {results && 
                <div className="new-child">
                    <div className="coverTitleContainer">
                        <img className="coverArt" src={`https:${results[0].cover.url}`} alt="Game cover art"/>
                        {!props.loggedIn && <button type="button" className="list_entry" onClick={(e) => addPlanning(e)}>Add to planning</button>}
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
                    {props.loggedIn && <button>Add Review</button>}
                </div>
            </div>
    );
}
 
export default GameDetails;