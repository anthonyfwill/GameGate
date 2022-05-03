import React from "react";

export default function GameStatus(props) {
    return (
        <div className="gameStatusContainer">
            <img id="game-pfp" src={props.GameCover}/>
            <h3>{props.GameName}</h3>
        </div>
    )
}