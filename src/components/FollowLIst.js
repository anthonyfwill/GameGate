import React from "react";
import { useParams } from "react-router-dom";

export default function FollowList(props) {
    const {username} = useParams();

    return (
        <div>
            <p>Followers of {username}</p>
        </div>
    )
}