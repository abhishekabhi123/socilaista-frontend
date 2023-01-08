import "./messenger.scss";
import "../../style.scss";
// import Topbar from "../../components/topbar/Topbar";
import Navbar from "../../components/navbar/Navbar";
import LeftBar from "../../components/leftBar/LeftBar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { io } from "socket.io-client";
import { DarkModeContext } from "../../context/darkModeContext";
import axios from "../../axios";
import InputEmoji from "react-input-emoji";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideoCalls from "../../components/videoCalls/VideoCalls";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export default function Messenger() {
  const { darkMode } = useContext(DarkModeContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [err, setErr] = useState(false);
  const [reciever, setReciever] = useState(null);
  const socket = useRef();
  const { currentUser, config } = useContext(AuthContext);
  const [conv, setConv] = useState({});
  const scrollRef = useRef();
  const queryClient = new QueryClient();
  const [notCount, setNotCount] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [messageReq, setMessageReq] = useState([]);
  let subtitle;

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "blue";
  }

  function closeModal() {
    setIsOpen(false);
  }
  useEffect(() => {
    socket.current = io("http://localhost:3000");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      conv?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, conv]);
  useEffect(() => {
    arrivalMessage &&
      !conv?.members.includes(arrivalMessage.sender) &&
      toast(`you have a message from${arrivalMessage.sender}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
  }, [arrivalMessage]);

  useEffect(() => {
    socket.current.emit("addUser", currentUser._id);

    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        currentUser.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [currentUser]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + currentUser._id);
        console.log("convs", res.data);
        // setMessageReq(res.data)
        // console.log(currentUser.followings.includes(res.data[0].members[0]),"followings");
        res.data.map((e) => {
          // console.log(e.members.find((m) => m !== currentUser._id));
          var sender = e.members.find((m) => m !== currentUser._id);
          if (!currentUser.followings.includes(sender)) {
            if (messageReq.length > 0) {
              messageReq.map((r) => {
                console.log(!r?._id === e._id);
                if (!r._id === e._id) {
                  setMessageReq([...messageReq, e]);
                }
              });
            } else {
              setMessageReq([...messageReq, e]);
            }

            console.log(e, "hi");
          }
        });
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser._id]);
  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + currentUser._id, config);
      setConversations(res.data);
    };

    getFriends();
  }, [currentUser._id]);
  useEffect(() => {
    setNotCount(0);
    const getMessages = async () => {
      try {
        await axios
          .get(`/conversations/find/${currentUser._id}/${currentChat}`, config)
          .then(async (response) => {
            setConv(response.data);
            if (response.data == null && currentChat != null) {
              await axios
                .post(
                  `/conversations/`,
                  { senderId: currentUser._id, receiverId: currentChat },
                  config
                )
                .then(async () => {
                  await axios
                    .get(
                      `/conversations/find/${currentUser._id}/${currentChat}`,
                      config
                    )
                    .then(async (res) => {
                      // setCurrentChat(res.data);
                      setConv(res.data);
                      await axios
                        .get("/messages/" + res.data?._id, config)
                        .then((res) => {
                          axios
                            .get("/users/" + currentChat, config)
                            .then((response) => {
                              console.log(response);
                              setReciever(response.data);
                            });

                          setMessages(res.data);
                        });
                    });
                });
            } else {
              // setCurrentChat(response.data);
              const res = await axios.get(
                "/messages/" + response.data?._id,
                config
              );
              axios.get("/users/" + currentChat, config).then((response) => {
                setReciever(response.data);
              });

              setMessages(res.data);
            }
          });
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim().length !== 0 && newMessage != null) {
      const receiverId = conv.members.find(
        (member) => member !== currentUser._id
      );
      const message = {
        sender: currentUser._id,
        receiverId,
        text: newMessage,
        conversationId: conv._id,
      };
      socket.current.emit("sendMessage", {
        senderId: currentUser._id,
        receiverId,
        text: newMessage,
      });

      try {
        let sendNot = false;
        setNotCount(notCount + 1);
        onlineUsers.includes(receiverId) || notCount === 0
          ? (sendNot = false)
          : (sendNot = true);

        const res = await axios.post(
          "/messages",
          { ...message, sendNot },
          config
        );
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err);
      }
    } else {
      setErr("please enter a message");
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };
  const handleChange = (newMessage) => {
    setErr(false);
    setNewMessage(newMessage);
  };
  return (
    <>
      <div className={`theme-${darkMode ? "dark" : "light"} animate-slideleft`}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* Same as */}
        <ToastContainer />
        <Navbar />

        <div style={{ display: "flex" }}>
          <QueryClientProvider client={queryClient}>
            <LeftBar />
          </QueryClientProvider>
          <div style={{ flex: 8 }}>
            <div className="msgReq" onClick={openModal}>
              Message requests
            </div>
            {messageReq.length > 0 && (
              <div
                className="absolute px-1 py-0.3 bg-red-600 text-white rounded-full text-xs mt-2.5 ml-3.5"
                style={{
                  right: "61px",
                  top: "61px",
                }}
              >
                {messageReq.length}
              </div>
            )}
            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              {messageReq.map((c) => (
                <div
                  onClick={() => {
                    setCurrentChat(
                      c.members.find((m) => m !== currentUser._id)
                    );
                    setIsOpen(false);
                  }}
                  key={c._id}
                >
                  <Conversation
                    conversation={c}
                    currentUser={currentUser}
                    req={true}
                  />
                </div>
              ))}
            </Modal>
            <div className="messenger">
              <div className="chatMenu">
                <input
                  value="Inbox"
                  className="chatMenuInput"
                  disabled
                  style={{ marginTop: "0.6rem", textAlign: "center" }}
                />
                <div className="chatMenuWrapper">
                  {conversations.map((c) => (
                    <div onClick={() => setCurrentChat(c._id)} key={c._id}>
                      <Conversation
                        conversation={c}
                        currentUser={currentUser}
                        req={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="chatBox">
                <div className="chatBoxWrapper">
                  {currentChat && (
                    <img
                      className="messageImg"
                      src={
                        reciever?.profilePicture.length !== 0
                          ? reciever?.profilePicture
                          : "https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                      }
                      alt=""
                    />
                  )}
                  <input
                    value={reciever ? reciever.username : "chat"}
                    className="receiver chatMenuInput"
                    disabled
                  />
                  {currentChat ? (
                    <>
                      <div className="chatBoxTop mt-3">
                        {messages.map((m) => (
                          <div ref={scrollRef} key={m.createdAt}>
                            <Message
                              message={m}
                              own={m.sender === currentUser._id}
                            />
                          </div>
                        ))}
                      </div>
                      {err && err}
                      <div className="chatBoxBottom">
                        <InputEmoji
                          value={newMessage}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                        />
                        <button
                          className="chatSubmitButton"
                          onClick={handleSubmit}
                        >
                          Send
                        </button>
                        {/* <VideoCalls /> */}
                      </div>
                    </>
                  ) : (
                    <span className="noConversationText font-bold text-5xl text-center mt-32">
                      Open a conversation to start a chat.
                    </span>
                  )}
                </div>
              </div>
              {/* <div className="chatOnline">
                <div className="chatOnlineWrapper">
                  <ChatOnline
                    onlineUsers={onlineUsers}
                    currentId={currentUser._id}
                    setCurrentChat={setCurrentChat}
                    setReciever={setReciever}
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
