import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Messenger from "./pages/messenger/Messenger"
import "./style.scss";
import { useContext, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import Notifications from "./pages/notification/Notifications";
import Error from "./pages/Error";
function App() {
  const {currentUser,message} = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const [right, setRight] = useState(true)
  const queryClient = new QueryClient()
  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
         {right&&<RightBar />}
        </div>
      </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    
    return children;

  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile/>,
        },
        {
          path:"/notifications",
          element:<Notifications/>
        },{
          path: "*",
          element: (
            <QueryClientProvider client={queryClient}>
              <Error />
            </QueryClientProvider>
          ),
        }
      ],
    },
    {
      path: "/login",
      element: currentUser?<Navigate to="/" />:<Login />
    },
    {
      path: "/register",
      element: currentUser?<Navigate to="/" />:<Register />,
    },
    {
      path: "/messages",
      element: currentUser?<Messenger/>:<Navigate to="/login" />,
    },
    
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
