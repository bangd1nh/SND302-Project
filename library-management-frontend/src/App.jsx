import { useState } from "react";
import "./App.css";
import Navbar from "./component/Navbar";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./component/Page/LandingPage";
import Footer from "./component/Footer";
import Login from "./component/Page/Login";
import Register from "./component/Page/Register";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
