import { authService, dbService } from 'fBase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Profile = ({userObj, refreshUser}) => {
    const history = useHistory();
    const [myNweets, setMyNweets] = useState('');
    const [newDisplayName, setNewDisplayName] = useState(userObj.DisplayName);
    const onLogOutClick = async () => {
        await authService.signOut();
        history.push("/");
    }
    const getMyNweets = async () => {
        const nweets = await dbService.collection('nweets').where("creatorID", "==", userObj.uid).orderBy('createdAt', "asc").get();
      const nweetsArray = nweets.docs.map(doc => doc.data());
      setMyNweets()
    }
    useEffect(() => {
        getMyNweets();
    }, []);
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.DisplayName !== newDisplayName) {
            await userObj.updateProfile({ displayName: newDisplayName });
        }
        refreshUser();
    }
    return(
        <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />     
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
    );
};
        
        
        
         //function component
export default Profile;