import "./navbar.scss";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
// import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useEffect, useState } from "react";
import axios from "../../axios";
import { Link } from "react-router-dom";

// import { Link } from "react-router-dom";
// import { useContext } from "react";
// import { DarkModeContext } from "../../context/darkModeContext";
// import { AuthContext } from "../../context/authContext";

const Navbar = () => {
  // const { toggle, darkMode } = useContext(DarkModeContext);
  // const { currentUser } = useContext(AuthContext);

  const [userData, setUserData] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios
      .get(`/users`)
      .then(({ data }) => setUserData(data))
      .catch((error) => console.log(error));
  }, []);
  const handleChange = async (e) => {
    const searchWord = e.target.value;
    setSearchWord(searchWord);
    const newFilter = await userData.filter((value) => {
      return value.username.toLowerCase().includes(searchWord.toLowerCase());
    });
    newFilter && setFilteredData(newFilter);
  };

  return (
    <div className="navbar ">
      <div className="left">
        {/* <Link to="/" style={{ textDecoration: "none" }}>
          <span className="icon">prosper</span>
        </Link> */}
        {/* <HomeOutlinedIcon /> */}

        {/* <GridViewOutlinedIcon /> */}
      </div>
      <div className="search rounded-full ">
        <SearchOutlinedIcon />
        <input
          type="text"
          id="search-navbar"
          value={searchWord}
          onChange={handleChange}
          placeholder="Find people..."
        />
        {searchWord && (
          <div className="absolute top-[-11rem] bg-gray-300 md:w-4/12  rounded-2xl mt-56">
            <ul className="relative">
              {filteredData.length > 0 ? (
                filteredData.map((user) => (
                  <Link
                    to={`/profile/${user._id}`}
                    onClick={() => setSearchWord("")}
                    key={user._id}
                    className="flex flex-wrap gap-2 items-center p-3 hover:bg-gray-200 border-b border-gray-200"
                  >
                    <img
                      src={user?.profilePicture}
                      alt={user?.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p>{user?.username}</p>
                  </Link>
                ))
              ) : (
                <li className="p-3 hover:bg-gray-300 border-b rounded-b-lg border-gray-200">
                  No results found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="right">
        {/* {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )} */}
        {/* <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <img
            src={currentUser.profilePic}
            alt=""
          />
          <span>{currentUser.name}</span>
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
