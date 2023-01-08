
import { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./conversation.css";

export default function Conversation({ conversation, currentUser,req}) {
  const [user, setUser] = useState(null);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {config} = useContext(AuthContext)
  useEffect(() => {
    let friendId = ""
    if (req) {
       friendId = conversation.members.find((m) => m !== currentUser._id);
       console.log("else part",friendId);
    }
    else{
      friendId = conversation._id
    }
    // 

    const getUser = async () => {
      try {
        const res = await axios.get("/users/" + friendId,config);
        // console.log("data is",res.data);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation hover:bg-slate-400 rounded-full">
      <img
        className="conversationImg"
        src={
          user?.profilePicture
            ? user.profilePicture
            :"https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png"
        }
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
