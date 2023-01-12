import axios from "axios";

const header = localStorage.getItem("accessToken")
  ? {
      token: "Bearer " + localStorage.getItem("accessToken"),
    }
  : {
      token: "Bearer ",
    };

const instance = axios.create({
  baseURL: "https://api.liansocialmedia.ml/api",
  headers: header,
  withCredentials: true,
});
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
export default instance;
