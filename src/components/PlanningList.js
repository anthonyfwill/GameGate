import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function PlanningList(props) {
    const {username} = useParams();
    const [planningList, setPlanningList] = useState([]);

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
                // console.log(data.Items[0].FollowingList.values);
                setPlanningList(data.Items[0].PlanningGames.values);
                // console.log(data.Items[0].PlanningGames);
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
        <div className="plannings">
            {planningList &&
                planningList.map((val) => {
                    return (
                    // <Link to={`/game/${val}`} key={val}>
                    <p key={val}>{val}</p>
                    // </Link>
                    )
                })
            }
        </div>
    )
}