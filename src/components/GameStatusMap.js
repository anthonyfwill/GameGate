import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import GameStatus from "./GameStatus";


export default function GameStatusMap(props) {
    const {username} = useParams();
    const [planningMap, setPlanningMap] = useState({});

    useEffect(() => {
        checkPlanningGames();
    }, [])

    const checkPlanningGames = async () => {
        if (planningMap != undefined) {
            await gamesExist();
        }
    }

    const gamesExist = async () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        fetch(`https://gamegate.herokuapp.com/api/user/${username}/gamestatuses`, requestOptions)
        .then(response => {
            if(!response.ok) {
                throw Error('Could not retrieve user');
            }
            return response.json();
        })
        .then(result => {
            if(result.Items.length != 0) {
                switch(props.type) {
                    case 'planning':
                        setPlanningMap(result.Items[0].PlanningGames);
                        break;
                    case 'currentG':
                        setPlanningMap(result.Items[0].CurrentGames);
                        break;
                    case 'completed':
                        setPlanningMap(result.Items[0].CompletedGames);
                        break;
                    case 'dropped':
                        setPlanningMap(result.Items[0].DroppedGames);
                        break;
                    default:
                        // console.log('Oops');
                        throw Error('Invalid game status type');
                        break;
                }
            }
        })
        .catch(error => {
            console.log(error.message);
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