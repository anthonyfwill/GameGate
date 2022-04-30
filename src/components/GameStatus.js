import React from "react";

export default function GameStatus(props) {
    return (
        <div>
            <img id="pfp" src={props.GameCover}/>
            <p>{props.GameName}</p>
        </div>
    )
}