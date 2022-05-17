import { useState, useEffect } from "react";

const useFetch = (id ,docClient) => {
    const [results, setResults] = useState(null);
    const [isPending, setPending] = useState(true);
    const [error, setError] = useState(null);
    const [reviewInfo, setReviewInfo] = useState([]);
    const [score, setScore] = useState(null);

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch('https://gamegate.herokuapp.com/api/game/' + id, requestOptions)
        .then(response => {
            if(!response.ok) {
                throw Error('Could not get info for that game');
            }
            return response.json()
        })
        .then(result => {
            setResults(result.game);
            setPending(false);
            setError(null);
            setReviewInfo(result.reviews.Items);
            setScore(result.averageScore);
        })
        .catch(error => {
            setError(error.message);
            setPending(false);
        });
    }, []);

    return { results, isPending, error, reviewInfo, setReviewInfo, score, setScore };
}

export default useFetch;