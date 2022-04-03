const Review = (props) => {
    return (
        <div className="review-container">
            <div className="single-review">
                <div>
                    {props.gameImage && <img src={`http:${props.gameImage}`} alt={props.name} />}
                    {props.name && <h3>{props.name}</h3> }
                </div>
                <div>
                    {props.profPic && <img src={props.profPic} alt={props.name}/>}
                    {props.username && <h3>{props.username}</h3>}
                </div>
                <p className="score-color">Score: {props.score}/10</p>
                <p>{props.content}</p>
            </div>
        </div>
    );
}
 
export default Review;