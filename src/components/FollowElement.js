import React from "react";

export default function FollowElement(props) {
    return (
        <div className="gameStatusContainer">
            <img id="game-pfp" src={props.ProfilePicture}/>
            <h3>{props.Username}</h3>
        </div>
    )
}