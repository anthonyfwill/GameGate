import { useState, useEffect } from "react";

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    return year;
}

const useFetch = (id ,docClient) => {
    const [results, setResults] = useState(null);
    const [isPending, setPending] = useState(true);
    const [error, setError] = useState(null);
    const [reviewInfo, setReviewInfo] = useState([]);
    const [score, setScore] = useState(null);

    useEffect(() => {
        var myHeaders = new Headers();
        myHeaders.append("Client-ID", `${process.env.REACT_APP_CLIENT_ID}`);
        myHeaders.append("Authorization", `${process.env.REACT_APP_BEARER_TOKEN}`);
        myHeaders.append("Content-Type", "text/plain");

        var raw = `fields name,first_release_date,genres.name,platforms.name,cover.url,summary; where id=${id};`;

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        fetch("https://rocky-hamlet-24680.herokuapp.com/https://api.igdb.com/v4/games", requestOptions)
        .then(response => {
            if(!response.ok) {
                console.log(response);
                throw Error('Could not get info for that game');
            }
            return response.json()
        })
        .then(result => {
            let arr = (result[0].cover.url).split('/');
            arr[6] = 't_cover_big';
            const newUrl = arr.join('/');
            result[0].smallCover = result[0].cover.url;
            result[0].cover.url = newUrl;
            result[0].first_release_date = timeConverter(result[0].first_release_date);
            setResults(result);
            setPending(false);
            setError(null);
        })
        .then(stuff => {
            var params2 = {
                TableName: "Games",
                KeyConditionExpression: "#gameID = :gameID3",
                ExpressionAttributeNames: {
                    "#gameID": "GameID",
                },
                ExpressionAttributeValues: {
                    ":gameID3": id
                }
            }
    
            docClient.query(params2, function(err, data) {
                if (!err) {
                    let newReviewInfo = [];
                    if (data.Count === 0) {
                        console.log(data);
                    } else {
                        console.log(data);
                    }
                    let totalScore = 0;
                    if(data.Count === 0) {
                        totalScore = 'No Ratings';
                    }
                    else{
                        for(let i = 0; i < data.Count; i++) {
                            totalScore += parseInt(data.Items[i].Rating);
                            // console.log(totalScore);
                            newReviewInfo.push(data.Items[i]);
                        }
                        totalScore = totalScore / data.Count;
                    }
                    totalScore = Math.round(totalScore * 100) / 100;
                    // console.log(totalScore);
                    // console.log(newReviewInfo);
                    // results[0].averageRating = totalScore;
                    setScore(totalScore);
                    setReviewInfo(newReviewInfo);
                    // console.log(newReviewInfo);
                } else {
                    console.log(err);
                }
            })
        })
        .catch(error => {
            console.log(error);
            setError(error.message);
            setPending(false);
        });
    }, []);

    return { results, isPending, error, reviewInfo, setReviewInfo, score, setScore };
}

export default useFetch;