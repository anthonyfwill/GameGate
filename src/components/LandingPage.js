import React from "react";

function LandingPage() {
    return (
        <><div className="indexcaptions">
            <h1>GameGate</h1>
        </div>
        <div className="captions">
                <img className="caption_images" src="https://i.imgur.com/Auyx11D.png" alt="img1" height="500" width="905" />
                <h2>Log your gaming history using our expansive database and user-friendly interface.</h2>

                <img className="caption_images" src="https://i.imgur.com/R0t7LxQ.png" alt="img2" height="500" width="905" />
                <h2>Rate your favorites and compare them with other users across the site.</h2>

                <img className="caption_images" src="https://i.imgur.com/6EDLvjk.png" alt="img3" height="500" width="905" />
                <h2>Review and share your opinions whilst making new friends.</h2>
            </div></>

    )
}

export default LandingPage;