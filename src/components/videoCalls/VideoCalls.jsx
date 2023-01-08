import { useState } from "react";
import { Button } from "@mui/material";
import VideoCall from "../VideoCall/VideoCall";
// import "./videocalls.scss";
import Videocam from "@mui/icons-material/Videocam";

function VideoCalls() {
  const [inCall, setInCall] = useState(false);

  return (
    <div className="vid" style={{ height: "100%" }}>
      {inCall ? (
        <VideoCall setInCall={setInCall} />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setInCall(true)}
          // className="vids"
        >
          <Videocam />
        </Button>
      )}
    </div>
  );
}

export default VideoCalls;
