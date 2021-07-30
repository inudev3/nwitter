
import { storageService, dbService } from "fBase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
          }
        let attachmentURL = "";
        if (attachment !== "") {
            event.preventDefault();
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`) //사용자 아이디경로 밑에 고유 uuid 파일명을 가짐
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentURL = await response.ref.getDownloadURL();
         
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorID: userObj.uid,
            attachmentURL
        }
         // 이미지 파일 attachment가 존재한다면 파일을 저장
       
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");
    }
    const onChange = (event) => {
        const { target: { value } } = event;
        setNweet(value);
    }
    const onFileChange = (event) => {
        const { target: { files } } = event;
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedevent) => {
            const { target: { result } } = finishedevent;
            setAttachment(result);
        }
        reader.readAsDataURL(file);
    }
    const onClearAttachment = () => {
        setAttachment("");
        document.querySelector('input[type="file"]').value = '';
    }



    return (
         <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
            <input
            className="factoryInput__input"
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
            />
            <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                opacity: 0,
                }}
                />
             {attachment && (
            <div className="factoryForm__attachment">
            <img
              src={attachment}
              style={{
                backgroundImage: attachment,
              }}
            />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>);
    };

    export default NweetFactory;
