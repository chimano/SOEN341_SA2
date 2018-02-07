import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
<<<<<<< HEAD
    , document.getElementById('foot')
=======
    , document.getElementById('root')
>>>>>>> c274a888efced85c48d5e0c96df83f5a1eb153ab
);
registerServiceWorker();
