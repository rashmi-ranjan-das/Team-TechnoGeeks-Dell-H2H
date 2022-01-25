
import React from "react";
import { Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from "./App";
import Home from "./views/Homepage/Home";


function initializeRoutes(){
    ReactDOM.render((
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    ),document.getElementById('root'))
}

export default initializeRoutes;