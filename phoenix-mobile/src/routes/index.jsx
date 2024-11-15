import { createBrowserRouter } from "react-router-dom";
import Main from "../views/index.jsx";
import Home from "../views/Home/index.jsx";
import Food from "../views/Food/index.jsx";
import OrderDetail from "../views/Order/Detail/index.jsx";
import OrderList from "../views/Order/List/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
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
]);

export default router;
