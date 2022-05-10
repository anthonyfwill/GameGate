import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import FollowElement from "./FollowElement";

export default function FollowList(props) {
    const {username} = useParams();
    const [followMap, setFollowMap] = useState({});

    useEffect(() => {
        checkFollowers();
    }, [])

    const checkFollowers = async () => {
        if (followMap != undefined) {
            await followersExist();
        }
    }

    const followersExist = async () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`http://localhost:5000/api/user/${username}/follows`, requestOptions)
        .then(response => {
            if(!response.ok) {
                throw Error('Could not find user information');
            }
            return response.json();
        })
        .then(results => {
            if(results.Items.length !== 0) {
                if(props.type === 'following') {
                    setFollowMap(results.Items[0].FollowingMap);
                } else {
                    setFollowMap(results.Items[0].FollowersMap);
                }
            }
        })
    }

    return (
        <div className="follows">
           {Object.entries(followMap).map(item => {
                return (
                    <Link to={`/profile/${item[1].Username}`} key={item[1].Username}>
                        <FollowElement Username={item[1].Username} ProfilePicture={item[1].ProfilePicture}/>
                    </Link>
                )
            })} 
        </div>    
    )
}
