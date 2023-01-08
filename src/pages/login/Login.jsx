import { useContext, useEffect, useState } from "react";
import "./login.scss";
import FormInput from "../../components/formInput/FormInput";
import { Link, useNavigate } from "react-router-dom";
// import Cookies from 'universal-cookie';
import { AuthContext } from "../../context/authContext";
import Modal from "react-modal";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/material";
import axios from "../../axios";
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

const Login = () => {
  // const cookies = new Cookies();
  // const navigate = useNavigate()
  const [err, setErr] = useState(false);
  const [counter, setCounter] = useState(25);
  const [otp, setOtp] = useState(false);
  const [phone, setPhone] = useState(false);
  const [status, setStatus] = useState(false);
  const [number, setNumber] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const { login, setCurrentUser, setConfig } = useContext(AuthContext);
  const navigate = useNavigate();
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "blue";
  }
  let timeout = useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  function closeModal() {
    setIsOpen(false);
  }
  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be a valid email address!",
      label: "Email",
      required: true,
    },

    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
  ];
  let details = values;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(details).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.log(error);
      setErr(error.response.data);
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleOTP = (e) => {
    e.preventDefault();
    if (phone.trim().length === 10) {
      setStatus("please wait...");
      axios
        .post("auth/sendotp", { phno: phone })
        .then(() => {
          setNumber(phone);
          setStatus("otp sent successfully");
        })
        .catch((err) => {
          setStatus(false);
          setErr(err.response.data);
        });
    } else {
      setErr("please enter a valid phone no.");
    }
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    if (otp.trim().length > 0 && number) {
      setStatus("please wait...");
      axios
        .post("auth/otplogin", { otp: otp, phno: number })
        .then((res) => {
          setCurrentUser(res.data.other);
          console.log(res.data);
          localStorage.setItem("accessToken", res.data.accessToken);
          setConfig({
            headers: { token: `Bearer ${res.data.accessToken}` },
          });
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          setErr(err.response.data.err);
        });
    } else {
      setErr("something went wrong please try again");
    }
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <h1 style={{ paddingTop: "10px" }} className="icon">
          Socialista
        </h1>
        <div className="msg" style={{ paddingBottom: "10px" }}>
          Login to see what your friends are doing
        </div>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <div className="error"> {err && err}</div>

        <button type="submit">Login</button>
        <div
          style={{
            width: "100%",
            height: "20px",
            borderBottom: "1px solid black",
            textAlign: "center",
            marginTop: "-15px",
            marginBottom: "6px",
          }}
        >
          <span
            style={{
              fontSize: "23px",
              backgroundColor: "#F3F5F6",
              padding: "0 10px",
            }}
          >
            OR
          </span>
        </div>
        <button type="button" onClick={openModal}>
          Login with OTP
        </button>

        <div style={{ paddingBottom: "29px" }}>
          New here?
          <b>
            <Link to="/register" className="link">
              Sign up now.
            </Link>
          </b>
          <br />
        </div>
      </form>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>OTP</h2>
        <CloseIcon onClick={closeModal} className="close" />

        <FormControl>
          {err && (
            <span style={{ top: "2rem", color: "red" }} className="err">
              {err}
            </span>
          )}
          {status && (
            <span style={{ top: "2rem", color: "green" }}>{status}</span>
          )}
          <TextField
            id="standard-basic"
            label="Enter your phone no."
            variant="standard"
            onChange={(e) => {
              setPhone(e.target.value);
              setErr(false);
            }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            className="sendButton"
            onClick={(() => timeout(), handleOTP)}
          >
            Send
          </Button>
          <TextField
            id="standard-basic"
            label="Enter OTP"
            variant="standard"
            onChange={(e) => setOtp(e.target.value)}
          />
          {/* {err&&<span style={{ top: "2rem", color: "red" }} className="err">{err}</span>} */}
          <Grid container>
            <Button
              variant="contained"
              className="sendButton"
              onClick={verifyOTP}
              style={{ backgroundColor: "blue", display: "inline" }}
            >
              Login
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              className="sendButton"
              onClick={(handleOTP, () => setCounter(30))}
              disabled={counter > 0 ? true : false}
            >
              Resend
            </Button>
          </Grid>
          <div>Send otp again in :{counter}</div>
        </FormControl>
      </Modal>
    </div>
  );
};

export default Login;
