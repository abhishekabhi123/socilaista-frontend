import Post from "../post/Post";
import "./posts.scss";
import {useQuery } from '@tanstack/react-query'
import  axios  from "../../axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const Posts = ({userId}) => {
  const navigate = useNavigate()
  const [err, setErr] = useState(false)
  const {config,setCurrentUser} = useContext(AuthContext)
     

  const { isLoading, error, data } = useQuery(["posts"], () =>
  axios.get(userId ?  `posts/profile/${userId}` : "posts/timeline/all",config).then((res) => {
    const sortedPosts = res.data.length>2?res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)):res.data;
    return sortedPosts || [];
  }).catch((e)=>{
    localStorage.removeItem("user");
    // localStorage.removeItem("accessToken");
    console.log(err);

    setErr(e.response?.data+"please re-login");
    setCurrentUser(false)
    navigate('/login')
  })
);



  return <div className="posts">
    {error? <span onClick={()=>{window.location.replace('/login')}} style={{cursor:"pointer"}}>{err}</span> :
      (isLoading ? "loading...":data.map(post=>(
        <Post post={post} key={post._id}/>
      )))
    }
   
  </div>;
};

export default Posts;
