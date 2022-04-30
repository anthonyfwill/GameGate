import React from "react";

export default function FollowElement(props) {
    return (
        <div>
            <img id="pfp" src={props.ProfilePicture}/>
            <p>{props.Username}</p>
        </div>
    )
}