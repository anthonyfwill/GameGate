import { useParams } from "react-router-dom";
import * as AWS from 'aws-sdk';
import { useState } from "react";

const Settings = (props) => {
    const [pfpEdit, setPfpEdit] = useState(false);
    const [profileUrl, setProfileurl] = useState('');
    const {username} = useParams();
  
    function updateProfilePic() {
    var params = {
        TableName:"GameGateAccounts",
        Key:{
            "Email": props.currUserInfo.Email
        },
        UpdateExpression: "set ProfilePicture = :profile",
        ExpressionAttributeValues:{
            ":profile":profileUrl
        },
        ReturnValues:"UPDATED_NEW"
    };

    props.docClient.update(params, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            const newResults = {};
            const someVal = Object.assign(newResults, props.CurrUserInfo);
            newResults.ProfilePicture = profileUrl;
            props.setCurrUserInfo(newResults);
            console.log(props.currUserInfo);
        }
    });
    
    setPfpEdit(false);
    setProfileurl('');
}
    return (
        <div className = 'feed_container'>
        <div className = 'posts_container'>
        <div className='image-section'>
                        <img id="pfp" src={props.currUserInfo.ProfilePicture}/>
                        {!props.pfpEdit && <button className="profileBtn" onClick={() => setPfpEdit(true)}>Change Profile Picture</button> }
                        {pfpEdit && <input type="text" value={profileUrl} onChange={(e) => setProfileurl(e.target.value)} placeholder="new profile image url"/>}
                        {pfpEdit && <button className="profileBtn" onClick={updateProfilePic}>Submit</button>}
                    </div>
        </div>
      </div>
    );

}
 
export default Settings;