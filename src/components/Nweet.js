import { dbService, storageService } from 'fBase';
import PropTypes from 'prop-types';
import React,{useState} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        if (ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            await storageService.refFromURL(nweetObj.attachmentURL).delete(); // 절대 URL로 REF를 참조할 수 있음. 즉 저장한 파일의 URL로 reference 참조 가능
        }

    };
    const toggleEditing = () => {
        setEditing(prev => !prev);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
            await dbService.doc(`nweets/${nweetObj.id}`).update({
                ...nweetObj,
                text:newNweet
            });
        setEditing(false);
    }
    const onChange = (event) => {
        const { target: { value } } = event;
        setNewNweet(value);
    }
    return (
        <div className="nweet">
            {editing?
                (<>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input type="text" onChange={onChange} value={newNweet} placeholder="Edit your Nweet" required autoFocus className="formInput"/>
                        <input type="submit" value="Update Nweet" className="formBtn" />
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
                </>)
                   : (
                    <>
                      <h4>{nweetObj.text}</h4>
                      {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
                        {isOwner && (
                         <div class="nweet__actions">
                          <span onClick={onDeleteClick}>
                            <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                            <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                        </div> 
                      )}
                    </>
                  )}
    </div>
  );
};
export default Nweet;