import Review from "./Review";

const Profile = () => {
    return (
        <div className="profile-container">
            <div className="stats-container">
                <div>
                    <img id="pfp" src="https://i.imgur.com/y0B5yj6.jpg"/>
                </div>
                <div>
                    <h2>Username</h2>
                </div>
                <div className="game-stats">
                    <div className="individual-stat-container">
                        <h2>0</h2>
                        <p>Current</p>
                    </div>
                    <div className="individual-stat-container">
                        <h2>0</h2>
                        <p>Completed</p>
                    </div>
                    <div className="individual-stat-container">
                        <h2>0</h2>
                        <p>Dropped</p>
                    </div>
                    <div className="individual-stat-container">
                        <h2>0</h2>
                        <p>Planning</p>
                    </div>
                </div>
                <div className="follow-stats">
                    <div className="individual-stat-container">
                        <h2>0</h2>
                        <p>Followers</p>
                    </div>
                    <div className="individual-stat-container">
                        <h2>0</h2>
                        <p>Followers</p>
                    </div>
                </div>
            </div>
            <div className="reviews-container">
                <div>
                    <h1>Reviews</h1>
                </div>
                <div className="reviews">
                    <Review />
                </div>
            </div>
        </div>
    );
}
 
export default Profile;