import { useState } from "react";
import "./App.css";
import Navbar from "./component/Navbar";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./component/Page/LandingPage";
import Footer from "./component/Footer";
import Login from "./component/Page/Login";
import Register from "./component/Page/Register";
import ForgotPassword from "./component/Page/ForgotPassword";
import ResetPassword from "./component/Page/ResetPassword";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/resetpassword" element={<ForgotPassword />} />
                <Route
                    path="/resetpassword/:token"
                    element={<ResetPassword />}
                />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
