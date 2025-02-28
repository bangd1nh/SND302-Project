import { useState } from "react";
import "./App.css";
import Navbar from "./component/Navbar";
import { Route, Routes } from "react-router-dom";
import LandingPage from "./Page/LandingPage";
import Footer from "./component/Footer";
import Login from "./Page/Login";
import Register from "./Page/Register";
import ForgotPassword from "./Page/ForgotPassword";
import ResetPassword from "./Page/ResetPassword";
import Category from "./Page/Category";

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
                <Route path="/category" element={<Category />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
