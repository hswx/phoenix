import { createHashRouter } from "react-router-dom";
import SignIn from "../views/login";
import Register from "../views/register";

const router = createHashRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <Register />,
  }
]);

export default router;
