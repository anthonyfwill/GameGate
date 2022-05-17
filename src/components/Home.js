import * as AWS from 'aws-sdk';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";

const Home = (props) => {
    const [userFeedList, setUserFeed] = useState(false);
    const [found, setFound] = useState(false);
    const [found2, setFound2] = useState(false);
    const [listFeed, setListFeed] = useState('');

    useEffect(() => {
        if(props.currUserInfo) {
            if (!found) {
                //Userfeed of user and following
                entireUserFeed();
            }
            if (!found2) {
                //onlyUserFeed(); UserFeed for only user
            }
        }
    });

    function displayUserFeed() {
        entireUserFeed();
    }

    function onlyUserFeed() {
            let arr = [];
            // console.log("I am here.");
            var params1 = {
                TableName: "UserFeed",
                KeyConditionExpression: "#email = :Email3",
                FilterExpression: "#date >= :Date3",
                ExpressionAttributeNames: {
                    "#email": "Email",
                    "#date": "DateOf"
                },
                ExpressionAttributeValues: {
                    ":Email3": props.currUserInfo.Email,
                    ":Date3": "5/11/2022, 12:14:07 AM"
                }
            }
            props.docClient.query(params1, function(err, data) {
                if(err) {
                    // console.log(data, "44444")
                } else if (!err) {
                    // console.log(data, "all feeds for user");
                    arr = makeList(data.Items.reverse());
                    // console.log(arr, "arr contents");
                    setListFeed(arr);
                    setFound2(true);
                }
            });
    }

    function entireUserFeed() {
       let arr = [];
            // console.log("EntireUserFeed");
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
                    // console.log(data, "55555")
                } else if (!err) {
                    //console.log(data.Items[0].UserFeedIDs, "all feeds for user");
                    arr = makeList(data.Items[0].UserFeedIDs.reverse());
                    setListFeed(arr);
                    setFound(true);
                    //console.log(arr, "List of actions", found);
                }
            });
    }

    function makeList(items) {
        let list = [];
        for (let i = 0; (i < items.length) && (i != 20); ++i) {
            list.push(items[i].Action);
        }
        /*items.forEach((item, index) => {
            if(index === )
            list.push(item.Action)
        })*/
        return list;
    }

    function testing2(theFeed) {
        if (found || found2) {
            //console.log(theFeed);
            return theFeed.map(text => {
                return (
                    <p>{text}</p>
                )
            })
        }
    }



    return (
        <div className="feed_container">
            <div className="posts_container">
                <div>
                    <h1>GameGate Home</h1>
                    {props.loggedIn && testing2(listFeed)}
                </div>
            </div>
        </div>
    );
}
 
export default Home;