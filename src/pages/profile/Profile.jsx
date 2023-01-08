import "./profile.scss";
// import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import PinterestIcon from "@mui/icons-material/Pinterest";
// import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import  axios  from "../../axios";
import { useLocation, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
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
import Swal from 'sweetalert2'
import FollowModal from "../../components/followModal/FollowModal";
import EditIcon from "@mui/icons-material/Edit";
import storage from "../../firebase";
import { Link } from "react-router-dom";
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
const Profile = () => {

  const [openUpdate, setOpenUpdate] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false)
  const [report, setReport] = useState('other')
  const [desc, setDesc] = useState(null)
  const [profileModal, setProfileModal] = useState(false)
  const [err, setErr] = useState(null)
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpen2, setIsOpen2] = useState(false);
  const [modalIsOpen3, setIsOpen3] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const { currentUser,config,setCurrentUser} = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  function openModal() {
    setIsOpen(true);
  }
  function openModal2() {
    setIsOpen2(!modalIsOpen2);
  }
  function openModal3() {
    setIsOpen3(!modalIsOpen3);
  }
  useEffect(()=>{
    const getAllUsers = (async()=>{
      axios.get(`users/`,config).then((users)=>{
        
        setAllUsers(users.data)
      },[])
    })
    getAllUsers()
   
  },[])

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
    setProfileModal(false)
  }

  const { id } = useParams()
  const userId = id;

  const { isLoading, error, data } = useQuery(["user"], () =>
    axios.get("/users/" + userId,config).then((res) => {
     
      return res.data;
    })
  );

  // const { isLoading: rIsLoading, data: relationshipData } = useQuery(
  //   ["relationship"],
  //   () =>
  //     axios.get("/relationships?followedUserId=" + userId).then((res) => {
  //       return res.data;
  //     })
  // );


  const queryClient = useQueryClient();



  const mutation = useMutation(
    (following) => {
      if (following){
      
       
        
        return axios.put(`users/${userId}/unfollow`,{},config)
     
      } 
      else{

    
        return axios.put(`users/${userId}/follow`,{},config)
      
    }
      
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate(data.followers.includes(currentUser._id));
  };
  const handleReport = () => {
    // e.preventDefault()
    if (report=="other"&&desc.trim().length!==0&&desc!=null) {
   
      axios.put(`posts/${userId}/reportUser`, { reason:desc },config).then((res) => {
      
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
      axios.put(`users/${userId}/reportUser`, { reason:report },config).then((res) => {
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
        console.log(err.response.data);
        setErr(err.response.data)
      })

    }
    else{
      setErr("Please specify reason")
    }
  }
  // const Input = () => {
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
            uploadTask.snapshot.ref.getDownloadURL().then(async(url) => {
              try {
                await axios.put(`/users/${currentUser._id}`,{profilePicture:url},config).then((response) => {
                  setCurrentUser({...currentUser,profilePicture:url})
                  setProfileModal(false)
                  setProfilePic(false)
                  setUploading(false)
                  console.log("after update",currentUser);
                  queryClient.invalidateQueries(["user"]);
              }).catch((err)=>{
                console.log(err,"hello");
               err.response.data.error?setErr(err.response.data.error):setErr(err.response.data)
                
              })
              } catch (error) {
                setErr(error.response.data)
                console.log(error,"hello");
              }
             
              // axios.post('/posts',{desc:desc,img:url},config)
              // queryClient.invalidateQueries(["posts"]);
             
              // setPost({desc:post,img:url})
              // console.log(post); 
            });
          }
        );
      });
    };
  const handleProfile =(e)=>{
    
      e.preventDefault();
      if (profilePic) {
        setUploading(true)
        upload([
          { file: profilePic, label: "img" },
        ]);
      }else{
        setErr("please choose an image")
      }
      
  }
  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={data.coverPicture} alt="" className="cover" />
            <img src={data.profilePicture} alt="" className="profilePic" />
            {currentUser?._id === data?._id && (
                    <EditIcon
                      onClick={() => setProfileModal(true)}
                      className="z-0 absolute bottom-11 shadow bg-white rounded-full p-1 edit"
                    />
                  )}
                  <Modal
            isOpen={profileModal}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <h2  style={{color:"blue",textAlign:"center"}}>Change profile picture</h2>
            <CloseIcon onClick={closeModal} className="close" />
            <input type="file" name="img" id="file" style={{display:"none"}} accept=".png, .jpeg, .jpg" onChange={e=>setProfilePic(e.target.files[0])}/>
            <label htmlFor="file">
              <div className="item" style={{textAlign:"center"}}> 
                <img style={{
                   width: "9rem",
                   marginRight: "auto",
                   marginLeft: "auto",
                   marginTop: "1rem",
                   borderRadius: "50%",
                   height:"9rem"
                }} src={profilePic? URL.createObjectURL(profilePic):currentUser.profilePicture} alt="" />
                <span style={{paddingTop:"3px"}}>Add Image</span><br /> 
                {err&&<span style={{color:"red",fontSize:".5rem",display:"block"}}>{err}</span>}
              <Button variant="contained" style={{backgroundColor:"blue"}} className="sendButton" onClick={handleProfile}>{uploading?"uploading...":"Change"}</Button>

                </div>
              </label>
          </Modal>
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.email}</span>
                  </div>

                </div>
                
                {/* <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a> */}
              </div>
              <div className="center">
                <span>{data.username}</span>
                {userId === currentUser._id ? <button onClick={() => setOpenUpdate(true)}>update</button>
                  :
                  <button onClick={handleFollow}>
                    {data.followers.includes(currentUser._id) ? 'following' : 'follow'}
                  </button>
                }
                  
                {/* {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )} */}
                <div className="desc">{data.desc} </div>
                <div className="item">

                  <span onClick={openModal3}style={{cursor:"pointer"}} >followers {data.followers.length}</span>&nbsp;&nbsp;
                  <span onClick={openModal2} style={{cursor:"pointer"}}>following {data.followings.length}</span>
                  {modalIsOpen3&&<FollowModal setIsOpen2={openModal3} ofUser={data} allUsers={{allUsers}} followings={false}/>}
      
                  {modalIsOpen2&&<FollowModal setIsOpen2={openModal2} ofUser={data} allUsers={{allUsers}} followings={true}/>}
                </div>
              </div>
              <div className="right">
              <Link to="/messages">
                <EmailOutlinedIcon />
                </Link>
                <MoreVertIcon style={{ cursor: "pointer" }} onClick={()=>setMenuOpen(!menuOpen)}/>
                {userId !== currentUser._id&&(menuOpen && <button onClick={openModal} style={{ backgroundColor: "orange" }}>Report</button>)}
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
            </div>
            <Posts userId={userId} key={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      
    </div>
  );
};

export default Profile;
