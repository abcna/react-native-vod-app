import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "antd/dist/antd.css";
import "./assets/css/global.scss";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./contect/userContext";

ReactDOM.render(
  <UserProvider>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </UserProvider>,
  document.getElementById("root")
);
