import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "782620ac8ccc491a9913c191d362bf99";
const token =
  "007eJxTYMg2tFIS9rao+WtQ+L1sxxyFt6WZbPxKq5MftidH/TwYd02BwdzCyMzIIDHZIjk52cTSMNHS0tA42dDSMMXYzCgpzdLSw2R1ckMgI8P/vjQGRigE8VkYchMz8xgYAM7wHiU=";
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
