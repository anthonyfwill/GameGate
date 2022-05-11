import * as AWS from 'aws-sdk';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";

const Home = (props) => {
    const [userFeedList, setUserFeed] = useState(false);
    const [found, setFound] = useState(false);
    const [listFeed, setListFeed] = useState('');

    useEffect(() => {
        if(props.currUserInfo) {
            if (!found) {
                entireUserFeed();
            }
        }
    });

    function displayUserFeed() {
        entireUserFeed();
    }

    function onlyUserFeed() {
            let arr = [];
            console.log("I am here.");
            var params1 = {
                TableName: "UserFeed",
                KeyConditionExpression: "#email = :Email3",
                FilterExpression: "#date >= :Date3",
                ExpressionAttributeNames: {
                    "#email": "Email",
                    "#date": "DateOf"
                },
                ExpressionAttributeValues: {
                    ":Email3": "anthonyfletcherw@gmail.com",
                    ":Date3": "5/5/2022, 8:44:41 PM"
                }
            }
            props.docClient.query(params1, function(err, data) {
                if(err) {
                    console.log(data, "44444")
                } else if (!err) {
                    console.log(data.Items, "all feeds for user");
                    console.log(typeof(data.Items), "type of ddata.items");
                    data.Items.forEach((item) => {
                        arr.push(
                            item.Action
                        );
                    })
                }
            });
            return arr;   
    }

    function entireUserFeed() {
       let arr = [];
            console.log("EntireUserFeed");
            var params1 = {
                TableName: "GameGateAccounts",
                KeyConditionExpression: "#email = :Email3",
                ExpressionAttributeNames: {
                    "#email": "Email"
                },
                ExpressionAttributeValues: {
                    ":Email3": props.currUserInfo.Email
                }
            }
            props.docClient.query(params1, function(err, data) {
                if(err) {
                    console.log(data, "55555")
                } else if (!err) {
                    console.log(data.Items[0].UserFeedIDs, "all feeds for user");
                    arr = makeList(data.Items[0].UserFeedIDs);
                    setListFeed(arr);
                    setFound(true);
                    console.log(arr, "List of actions", found);
                }
            });
    }

    function makeList(items) {
        let list = [];
        items.forEach((item, index) => {
            console.log(index)
            list.push(item.Action)
        })
        return list.reverse();
    }


    function testing2(theFeed) {
        if (found) {
            console.log(theFeed, "arr?");
            return theFeed.map(text => {
                return (<ul>
                    <ul>{text}</ul>
                </ul>)
            })
        }
    }



    return (
        <div className="feed_container">
            <div className="posts_container">
                <div>
                    <h1>GameGate Home</h1>
                    {testing2(listFeed)}
                </div>
            </div>
        </div>
    );
}
 
export default Home;