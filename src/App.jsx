import "./App.css";

//importing the pages
import UserListingPage from "./Pages/UserListingPage.jsx";
import SignUpPage from "./Pages/SignUpPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage.jsx";
import ViewAndEdit from "./Pages/ViewAndEdit.jsx";
// importing the components
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewHomePage from "./Pages/NewHomePage/NewHomePage.jsx";

//setting up the router

const router = createBrowserRouter([
  {
    path: "/",
    element: <NewHomePage />,
    children: [
      // {
      //   path: "view",
      //   element: <ViewAndEdit />,
      // },
      // {
      //   path: "edit",
      //   element: <ViewAndEdit />,
      // },
    ],
  },

  {
    path: "/users",
    element: <UserListingPage />,
    children: [],
  },
  {
    path: "/users/:id",
    element: <ViewAndEdit />,
    children: [],
  },
  {
    path: "/signup",
    element: <SignUpPage />,
    children: [],
  },
  {
    path: "/forgotpassword",
    element: <ForgotPasswordPage />,
    children: [],
  },
  {
    path: "/login",
    element: <LoginPage />,
    children: [],
  },
  {
    path : "/newhomepage",
    element : <NewHomePage />

  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
