import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import RecordList from "./components/RecordList";
import Record from "./components/Record";
import Landing from "./components/Landing";
import AddEmployee from "./components/AddEmployee";
import AboutUs from "./components/AboutUs";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/records", element: <RecordList /> },
      { path: "/create", element: <AddEmployee /> },
      { path: "/edit/:id", element: <Record /> },
      { path: "/about", element: <AboutUs /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

