import { createHashRouter } from "react-router-dom";
import Register from "../views/Register";
import Login from "../views/Login";
import Dashborad from "../views/Dashboard";

const router = createHashRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <Dashborad />,
    children: [
      {
        index: true,
        element: <></>
      }
    ]
  }
]);

export default router;
