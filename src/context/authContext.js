import { createContext, useEffect, useState } from "react";
import axios from "../axios";
import Cookies from 'universal-cookie';
export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user"))||null);
  const token = localStorage.getItem('accessToken')||null;
  const [config, setConfig] = useState(false)
  // if (JSON.parse(localStorage.getItem("user")) !== undefined) {
  //   setCurrentUser(JSON.parse(localStorage.getItem("user")))
  // }

  const login = async(details) => {
    //TO DO
    await axios.post(`/auth/login`,details,{withCredentials: true}).then((res)=>{
    console.log(res);
    setCurrentUser(res.data.other)
    localStorage.setItem("accessToken",res.data.accessToken)
    setConfig({
      headers: { token: `Bearer ${res.data.accessToken}` },      
  })
  
    })
   
  };

  useEffect(() => {
    if (currentUser!=undefined) {
      
        localStorage.setItem("user", JSON.stringify(currentUser));
        // localStorage.setItem("accessToken", accessToken);

        // console.log(cookies.get('accessToken'));

      
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, setCurrentUser, token,config,setConfig}}>
      {children}
    </AuthContext.Provider>
  );
};
