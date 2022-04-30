import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import FollowElement from "./FollowElement";

export default function FollowList(props) {
    const {username} = useParams();
    const [followMap, setFollowMap] = useState({});

    useEffect(() => {
        checkFollowers();
        console.log(followMap, "use");
    }, [])

    const checkFollowers = async () => {
        if (followMap != undefined) {
            await followersExist();
        }
    }

    const followersExist = () => {
         var params = {
            TableName: "GameGateAccounts",
            IndexName: "Username-index",
            KeyConditionExpression: "#username = :User3",
            ExpressionAttributeNames: {
                "#username": "Username"
            },
            ExpressionAttributeValues: {
                ":User3": username
            }
        }
        props.docClient.query(params, function(err, data) {
            if(err) {
                console.log('Could not retrieve user');
            } else {
                if (data.Items.length !== 0) {
                    if (props.type === "following") {
                        setFollowMap(data.Items[0].FollowingMap);
                    } else {
                        setFollowMap(data.Items[0].FollowersMap);
                    }
                }
            }
        })
    }

    return (
        <div className="follows">
           {Object.entries(followMap).map(item => {
            {console.log(item[1].Username, "render")}
                return (
                    <Link to={`/profile/${item[1].Username}`} key={item[1].Username}>
                        <FollowElement Username={item[1].Username} ProfilePicture={item[1].ProfilePicture}/>
                    </Link>
                )
            })} 
        </div>    
    )
}
