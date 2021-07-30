import { dbService,storageService } from '../fBase';
import React, { useEffect, useState } from 'react';
import Nweet from 'components/Nweet';
import PropTypes from 'prop-types';

import NweetFactory from 'components/NweetFactory';

const Home = ({ userObj }) => {
    
    const [nweets, setNweets] = useState([]);
    
    useEffect(() => {
        dbService.collection("nweets").orderBy("createdAt","desc").onSnapshot(snapshot => { 
            const nweetArray = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNweets(nweetArray);
        })
    }, [])
    
    
    return (
        <div className="container">
        <NweetFactory userObj={userObj}/>
        <div style={{ marginTop: 30 }}>
             {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorID === userObj.uid}
          />
        ))}
        </div>
    </div>
    )
};

     //function component
export default Home;