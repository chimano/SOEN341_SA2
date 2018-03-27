// @flow

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";

const ROOT_CONTAINER_SELECTOR = "root";
const rootEl = document.getElementById(ROOT_CONTAINER_SELECTOR);
if (!(rootEl instanceof Element)) {
  throw new Error("invalid type");
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootEl
);
registerServiceWorker();
