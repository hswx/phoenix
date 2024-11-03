import { createHashRouter } from "react-router-dom";
import Register from "../views/Register";
import Login from "../views/Login";
import Dashborad from "../views/Dashboard";
import FoodManage from "../views/Dashboard/views/FoodManage";

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
        path: "food-manage",
        element: <FoodManage />
      }
    ]
  }
]);

export default router;
