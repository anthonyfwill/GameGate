import * as AWS from 'aws-sdk';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "./useFetch";

const Home = (props) => {
    const [userFeedList, setUserFeed] = useState(false);
    const [found, setFound] = useState(false);

    useEffect(() => {
        if(props.currUserInfo) {
            setUserFeed(true);   
        }
    });

    function displayUserFeed() {
        let listing =  userFeed();
        console.log("list: ", listing);
        console.log("size: ", listing.length);
        return listing;
    }

    function userFeed() {
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

    function makeList(items) {
        let list = items.map( (item, index) => {
            return (
                <li key={index}>apple</li>
            );
        });
        return list;
    }



    return (
        <div className="feed_container">
            <div className="posts_container">
                <div>
                    <h1>GameGate Home</h1>
                    {displayUserFeed()}
                </div>
            </div>
        </div>
    );
}
 
export default Home;