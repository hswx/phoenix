import React from "react";
import { createHashRouter } from "react-router-dom";
import Dashborad from "../views/Dashboard";

const Login = React.lazy(() => import("./../views/Login"));
const Register = React.lazy(() => import("./../views/Register"));
const FoodManage = React.lazy(() => import("./../views/Dashboard/views/FoodManage"));
const CategoryManage = React.lazy(() => import("./../views/Dashboard/views/CategoryManage"));
const EmployeeManage = React.lazy(() => import("./../views/Dashboard/views/EmployeeManage"));

const router = createHashRouter([
  {
    index: true,
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashborad />,
    children: [
      {
        index: true,
        element: <>首页</>,
      },
      {
        path: "food-manage",
        element: <FoodManage />
      },
      {
        path: "category-manage",
        element: <CategoryManage />
      },
      {
        path: "employee-manage",
        element: <EmployeeManage />
      }
    ]
  }
]);

export default router;
