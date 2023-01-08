import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../axios";
import ReactTimeAgo from "react-time-ago";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Swal from "sweetalert2";

const Comments = ({ post }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const { currentUser, token } = useContext(AuthContext);
  const queryClient = useQueryClient();
  function openModal() {
    setIsOpen(true);
  }
  const sortedComments = post.comments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const config = {
    headers: {
      token: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const mutation = useMutation(
    (newComment) => {
      return axios.put(`/posts/${post._id}/comment`, newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleClick(event);
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    const newComment = {
      comment: desc,
      profilePic: currentUser.profilePicture,
      name: currentUser.username,
    };
    mutation.mutate(newComment);
    setDesc("");
  };
  const deleteMutation = useMutation(
    ({ commentId, postId }) => {
      config.postId = postId;
      console.log("config : ", postId, config);
      return axios.put("/posts/uncomment/" + commentId, config);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  const handleDelete = (commentId, postId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate({ commentId, postId });
      }
    });
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePicture} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {sortedComments.map((comment) => (
        <div className="comment" key={comment._id}>
          <img src={comment.profilePic} alt="" />
          <div className="c_container">
            <div className="arrow">
              <div className="outer"></div>
              <div className="inner"></div>
            </div>
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.comment}</p>
            </div>
          </div>

          <span className="date">
            <ReactTimeAgo date={comment.createdAt} locale="en-US" />
          </span>
          {comment.userId == currentUser._id && (
            <MoreHorizIcon
              onClick={() => {
                setMenuOpen(comment._id);
                updateOpen && setUpdateOpen(!updateOpen);
              }}
              style={{ cursor: "pointer" }}
            />
          )}
          {menuOpen === comment._id && (
            <button
              onClick={() => {
                handleDelete(comment._id, post._id);
              }}
              style={{ backgroundColor: "blue", width: "3rem", height: "2rem" }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
