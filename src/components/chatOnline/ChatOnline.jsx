
import { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { AuthContext } from "../../context/authContext";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat,setReciever }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {config} = useContext(AuthContext)
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + currentId,config);
      setFriends(res.data);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (user) => {
    try {
   
          axios.get("/users/" + user._id,config).then((response)=>{
            console.log(response);
            setReciever(response.data)})
      
      const res = await axios.get(
        `/conversations/find/${currentId}/${user._id}`,config
      );
     
      setCurrentChat(user._id);
      if (res.data==null) {
        await axios.post(
          `/conversations/`,{senderId:currentId,receiverId:user._id},config
        ).then(async()=>{
          const res = await axios.get(
            `/conversations/find/${currentId}/${user._id}`,config
          );
          console.log(res);
          setCurrentChat(res.data);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      <input value="Online" className="chatMenuInput" disabled/>
      {onlineFriends.length===0&&"No one online"}
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)} key={o._id}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? o.profilePicture
                  : "https://i.pinimg.com/originals/0d/dc/ca/0ddccae723d85a703b798a5e682c23c1.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
