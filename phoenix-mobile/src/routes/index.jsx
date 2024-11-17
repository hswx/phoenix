import React from "react";
import { createBrowserRouter } from "react-router-dom";

const Main = React.lazy(() => import("../views/index.jsx"));
const Home = React.lazy(() => import("../views/Home/index.jsx"));
const Food = React.lazy(() => import("../views/Food/index.jsx"));
const OrderDetail = React.lazy(() => import("../views/Order/Detail/index.jsx"));
const OrderList = React.lazy(() => import("../views/Order/List/index.jsx"));
const Auth = React.lazy(() => import("../views/Auth/index.jsx"));

const router = createBrowserRouter([
  {
    index: "/",
    element: <Main />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/food",
        element: <Food />
      },
      {
        path: "/order/:id",
        element: <OrderDetail />
      },
      {
        path: "/order/list",
        element: <OrderList />
      },
    ]
  },
  {
    path: "/auth",
    element: <Auth />
  }
]);

export default router;
