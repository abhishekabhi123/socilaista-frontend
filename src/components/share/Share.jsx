import "./share.scss";
import Image from "../../assets/img.png";
// import Map from "../../assets/map.png";
// import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import storage from "../../firebase";
import { AuthContext } from "../../context/authContext";
import axios from "../../axios";
import { useQueryClient } from "@tanstack/react-query";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import EmojiPicker from "emoji-picker-react";
import { EmojiStyle } from "emoji-picker-react";
const Share = () => {
  const [desc, setDesc] = useState(null);
  const [img, setImg] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { currentUser, config } = useContext(AuthContext);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const queryClient = useQueryClient();
  const handleChange = (e) => {
    const value = e.target.value;
    setDesc(value);
  };
  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const uploadTask = storage.ref(`/items/${fileName}`).put(item.file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(async (url) => {
            axios.post("/posts", { desc: desc, img: url }, config);
            queryClient.invalidateQueries(["posts"]);
            setDesc("");
            setImg(null);
            setUploading(false);
          });
        }
      );
    });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleUpload(event);
    }
  };
  const handleUpload = (e) => {
    if (desc?.trim().length !== 0 && desc != null) {
      if (img == null) {
        axios.post("/posts", { desc: desc }, config);
        queryClient.invalidateQueries(["posts"]);
        setDesc("");
      } else {
        setUploading(true);
        e.preventDefault();
        upload([{ file: img, label: "img" }]);
      }
    } else {
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={currentUser.profilePicture} alt="" />

            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.username}?`}
              onChange={handleChange}
              value={desc}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="right">
            {img && (
              <img className="file" alt="" src={URL.createObjectURL(img)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              name="img"
              id="file"
              style={{ display: "none" }}
              accept=".png, .jpeg, .jpg"
              onChange={(e) => setImg(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <InsertEmoticonIcon onClick={() => setEmojiOpen(!emojiOpen)} />
              {emojiOpen && (
                <EmojiPicker
                  onEmojiClick={(e) => {
                    setDesc((prev) => {
                      return prev ? prev + e.emoji : e.emoji;
                    });
                    setEmojiOpen(false);
                    console.log(e);
                  }}
                />
              )}
            </div>
          </div>
          <div className="right">
            <button onClick={handleUpload}>
              {uploading ? "Uploading..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
