import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import GameStatus from "./GameStatus";


export default function GameStatusMap(props) {
    const {username} = useParams();
    const [planningMap, setPlanningMap] = useState({});

    useEffect(() => {
        checkPlanningGames();
        console.log(planningMap, "planning");
    }, [])

    const checkPlanningGames = async () => {
        if (planningMap != undefined) {
            await gamesExist();
        }
    }

    const gamesExist = () => {
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
                    if (props.type === "planning") {
                        setPlanningMap(data.Items[0].PlanningGames);
                        console.log(props.type);
                    } else if (props.type === "currentG") {
                        setPlanningMap(data.Items[0].CurrentGames);
                        console.log(props.type);
                    } else if (props.type === "completed") {
                        setPlanningMap(data.Items[0].CompletedGames);
                        console.log(props.type);
                    } else if (props.type === "dropped") {
                        setPlanningMap(data.Items[0].DroppedGames);
                        console.log(props.type);
                    }
                }
            }
        })
    }

    return (
        <div className="plannings">
            {Object.entries(planningMap).map(item => {
                return (
                    <Link to={`/game/${item[1].GameID}`} key={item[1].GameID}>
                        <GameStatus GameName={item[1].GameName} GameCover={item[1].GameCover}/>
                    </Link>
                )
            })} 
        </div>
    )
}