import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import FollowElement from "./FollowElement";

export default function FollowList(props) {
    const {username} = useParams();
    const [followList, setFollowList] = useState([]);

    useEffect(() => {
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
                // setError('Could not retrieve user');
                // setPending(false);
            } else if(data.Count === 0) {
                console.log('User does not exist');
                // setError('User does not exist');
                // setPending(false);
            }
            else {
                console.log(data.Items[0].FollowingList.values);
                setFollowList(data.Items[0].FollowingList.values);
                // const newResults = [];
                // for(let i = 0; i < data.Count; i++) {
                //     newResults.push(data.Items[i]);
                // }
                // setUserInfo(newResults);
                // setResults([]);
                // setResults(data.Items[0]);
                // setPending(false);
                // setError(null);
            }
        })
    }, [])

    return (
        <div className="follows">
            {followList &&
                followList.map((val) => {
                    return (
                    <Link to={`/profile/${val}`} key={val}>
                        <FollowElement username={val} key={val}/>
                    </Link>
                    // <FollowElement username={val} key={val}/>
                    )
                    // return <p key={val}>{val}</p>
                })
            }
        </div>
    )
}