import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import ReactTimeAgo from 'react-time-ago'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import Swal from 'sweetalert2'
import Modal from 'react-modal';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
Modal.setAppElement('#root');
const Post = ({ post }) => {
  const { currentUser,config,token } = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [user, setUser] = useState({});
  const [menuOpen, setMenuOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false);
  const [desc, setDesc] = useState(null)
  const [liked, setLiked] = useState(post.likes.includes(currentUser._id) ? true : false)
  const [report, setReport] = useState('other')
  const queryClient = useQueryClient();
  const [err, setErr] = useState(null)
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    axios.get(`users/${post.userId}`,config).then((res) => {
      setUser(res.data)
    }).catch((err) => { console.log(err); })
    post.likes.includes(currentUser._id) ? setLiked(true) : setLiked(false)
  }, [post])

  const deleteMutation = useMutation(
    (postId) => {
      return axios.delete("/posts/" + postId,config);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  //TEMPORARY
  // const liked = true;
  const handleLike = () => {
    const accessToken = localStorage.getItem('accessToken')
    axios.put(`posts/${post._id}/like`,{},{headers: {
      'token': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
  }
}).then(() => {
      setLiked(!liked)
      queryClient.invalidateQueries(["posts"]);
    }).catch((err)=>{
      console.log(err,config);
    })
  }

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(post._id);
      }
    })

  };
  const handleUpdate = () => {
    // e.preventDefault()
    if (desc) {
      axios.put(`posts/${post._id}`, { desc },config).then((res) => {
        setUpdateOpen(!updateOpen)
        queryClient.invalidateQueries(["posts"]);
      })
    } else {
      setDesc(null)
      setUpdateOpen(!updateOpen)

    }
  }

  const handleReport = () => {
    // e.preventDefault()
    if (report=="other"&&desc.trim().length!==0&&desc!=null) {
      console.log("Entry test");
      axios.put(`posts/${post._id}/report`, { reason:desc },config).then((res) => {
        console.log(res);
        Swal.fire({
          title: 'Reported!',
          text: 'Thanks for reporting',
          icon: 'success',
          confirmButtonText: 'ok'
        })
        closeModal()
        setDesc("")
        setMenuOpen(false)
        setErr(null)
      }).catch((err)=>{
        setErr(err.response.data)
      })
    } else if(report!=="other") {
      axios.put(`posts/${post._id}/report`, { reason:report },config).then((res) => {
        Swal.fire({
          title: 'Reported!',
          text: 'Thanks for reporting',
          icon: 'success',
          confirmButtonText: 'ok'
        })
        closeModal()
        setDesc("")
        setMenuOpen(false)
        setErr(false)
      }).catch((err)=>{
        setErr(err.response.data)
      })

    }
    else{
      setErr("Please specify reason")
    }
  }
  // const Input = () => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleUpdate()
    }
  }
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={user.profilePicture} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{user.username}</span>
              </Link>
              <span className="date"><ReactTimeAgo date={post.createdAt} locale="en-US" /></span>
            </div>
          </div>

          <MoreHorizIcon onClick={() => {
            setMenuOpen(!menuOpen)
            updateOpen && setUpdateOpen(!updateOpen)
          }} style={{ cursor: "pointer" }} />
          {post.userId === currentUser._id ? menuOpen && post.userId === currentUser._id && (
            <>
              <button onClick={handleDelete}>Delete</button>
              <button onClick={handleUpdate} style={{ top: "4rem", backgroundColor: "blue"}}>Update</button>
            </>
          ) : menuOpen && <button onClick={openModal} style={{ backgroundColor: "orange" }}>Report</button>
          }
          {updateOpen && (<><input type="text" placeholder="update description" onChange={(e) => setDesc(e.target.value)} onKeyDown={handleKeyDown} /></>)}
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Report</h2>
            <CloseIcon onClick={closeModal} className="close" />
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Please specify reason</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="other"
                name="radio-buttons-group"
              >
                <FormControlLabel value="spam" control={<Radio />} label="spam" onChange={e=>{setReport(e.target.value)}}/>
                <FormControlLabel value="fraud" control={<Radio />} label="fraud" onChange={e=>setReport(e.target.value)}/>
                <FormControlLabel value="false information" control={<Radio />} label="false information" onClick={e=>setReport(e.target.value)}/>
                <FormControlLabel value="other" control={<Radio />} label="other" onClick={e=>setReport(e.target.value)}/>
              </RadioGroup>
              {report==="other"&&<TextField id="standard-basic" label="please say more about it" variant="standard" onChange={e=>setDesc(e.target.value)}/>}
              {err&&<span style={{ top: "2rem", color: "red" }} className="err">{err}</span>}
              <Button variant="contained" endIcon={<SendIcon />} className="sendButton" onClick={handleReport}>Send</Button>
            </FormControl>
          </Modal>
        </div>
        <div className="content" onDoubleClick={handleLike}>
          <p>{post.desc}</p>
          <img src={post.img} alt="" />
        </div>
        <div className="info">
          <div className="item" onClick={handleLike}>
            {liked ? <FavoriteOutlinedIcon style={{ color: "red" }} /> : <FavoriteBorderOutlinedIcon />}
            {post.likes.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {post.comments.length} Comments
          </div>
          {/* <div className="item">
            <ShareOutlinedIcon />
            Share
          </div> */}
        </div>
        {commentOpen && <Comments post={post} />}
      </div>
    </div>
  );
};

export default Post;
