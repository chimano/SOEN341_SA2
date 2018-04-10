// @flow
/* global document, Element */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const ROOT_CONTAINER_SELECTOR = 'root';
const rootEl = document.getElementById(ROOT_CONTAINER_SELECTOR);
if (!(rootEl instanceof Element)) {
  throw new Error('invalid type');
}

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootEl,
);
registerServiceWorker();
