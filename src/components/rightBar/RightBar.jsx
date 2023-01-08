import React, { useEffect } from 'react'
import "./rightBar.scss"
// import pic from "../../assets/tp-best-mens-hairstyles.jpg"
import axios from '../../axios'
import { useState } from 'react'
import { useContext } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'


function RightBar() {
  const queryClient = useQueryClient();
  const {currentUser,setCurrentUser,config} = useContext(AuthContext)
  const [allUsers, setAllUsers] = useState([])
  
  useEffect(()=>{
    const getAllUsers = (async()=>{
      axios.get(`users/`,config).then((users)=>{
     
        setAllUsers(users.data)
      },[])
    })
    getAllUsers()
  },[])

  const { isLoading, error, data } = useQuery(["suggestions"], () =>
    axios.get(`users/`,config).then((res) => {
    const users = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    setAllUsers(users) 
   
    
    return res.data;
  })
);


  const follow =(userId)=>{
    axios.put(`users/${userId}/follow`,{ userId :currentUser._id},config)
    setCurrentUser(prev=>{prev.followings.push(userId);let followings=prev.followings;console.log(followings,userId); return  {...currentUser,followings};}) 
    console.log(userId);
    queryClient.invalidateQueries(["user"]);
    queryClient.invalidateQueries(["suggestions"]);
    queryClient.invalidateQueries(["posts"]);


  }
  return (
    <div className="rightBar">
      <div className="container">
      <div className="item">
          <span>New users</span>
          {allUsers.map(user=>(
          currentUser.username!=user.username &&  !user.followers.includes(currentUser._id) && <div className="user" key={user._id}>
            <div className="userInfo" key = {user._id} >
              <Link
              to={`/profile/${user._id}`}>
              <img src={user.profilePicture} />
              </Link>
              <Link to={`/profile/${user._id}`} style={{textDecoration:"none"}}>
              <span>{user.username}</span>
              </Link>
            </div>
            <div className="buttons">
           { !user.followers.includes(currentUser._id)?
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded' onClick={()=>follow(user._id)} >follow</button>:
              <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded' >dismiss</button>}
            </div>
          </div>
          ))}

        </div>
        {/* <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>Jane Doe</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default RightBar;
