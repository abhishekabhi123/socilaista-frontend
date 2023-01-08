import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import './followModal.css'
import { Link } from "react-router-dom";
function FollowModal({setIsOpen2, allUsers,ofUser,followings}){
    //  console.log(allUsers.allUsers,"-----");
    const users =allUsers.allUsers;
    const queryClient =useQueryClient();
    const{currentUser} = useContext(AuthContext)
    const altImg = "https://avatars.githubusercontent.com/u/69767?v=4";
    const modalHandler = () =>{
        setIsOpen2(false)
        queryClient.invalidateQueries(["user"])
    }

    return (
        <div className="modalBackground" onClick={() => {
            setIsOpen2();
          }}>
          <div className="modalContainer animate-slideleft">
            <div className="titleCloseBtn">
              <button
                onClick={()=>setIsOpen2()}
              >
                X
              </button>
            </div>
            <div className="title">
                {followings?
              <h1>People {ofUser.username} follows</h1>
                : <h1>People following {ofUser.username} </h1> }
            </div>
            <div className="body overflow-x-auto">
              
    
            {followings?users.map(user=>(
                user.followers.includes(ofUser._id) && <div className="user">
                <div className="userInfo flex items-center mt-5 hover:bg-gray-300 rounded-full" key = {user._id}  onClick={()=>modalHandler()} >
                  <Link
                  to={`/profile/${user._id}`}>
                  <img className="rounded-full w-20 h-20 object-cover" src={user.profilePicture || altImg } />
                  </Link>
                  <Link to={`/profile/${user._id}`}>
                  <span className="font-bold ml-10 text-xl hover:from-stone-300">{user.username}</span>
                  </Link>
                </div>
                
              </div>
              )):
              users.map(user=>(
                user.followings.includes(ofUser._id) && <div className="user">
                <div className="userInfo flex items-center mt-5 hover:bg-gray-300 rounded-full" key = {user._id}  onClick={()=>modalHandler()} >
                  <Link
                  to={`/profile/${user._id}`}>
                  <img className="rounded-full w-20 h-20 object-cover" src={user.profilePicture || altImg } />
                  </Link>
                  <Link to={`/profile/${user._id}`}>
                  <span className="font-bold ml-10 text-xl hover:from-stone-300">{user.username}</span>
                  </Link>
                </div>
                
              </div>
              ))
              
              
              
              }
    
    
    
            </div>
            <div className="footer">
              {/* <button
                onClick={() => {
                  setIsOpen2(false);
                }}
                id="cancelBtn"
              >
                Cancel
              </button> */}
            </div>
          </div>
        </div>
      );
    }
    
    export default FollowModal;
    