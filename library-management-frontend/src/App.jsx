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
import BookDetail from "./Page/BookDetail";
import UserProfile from "./Page/UserProfile";
import Admin from "./Page/Admin";
import AdminSideBar from "./component/AdminSideBar";
import { isAdminUser, isUserLoggedIn } from "./Services/authenticateService";
import BookTable from "./component/BookTable";
import AdminBookDetail from "./Page/AdminBookDetail";

function App() {
    function AuthenticatedRoute({ children }) {
        const isAuth = isUserLoggedIn();

        if (isAuth && isAdminUser()) {
            return children;
        }

        return <Navigate to="/login" />;
    }
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Navbar />
                            <LandingPage />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <>
                            <Navbar />
                            <Login />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <>
                            <Navbar />
                            <Register />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/resetpassword"
                    element={
                        <>
                            <Navbar />
                            <ForgotPassword />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/resetpassword/:token"
                    element={
                        <>
                            <Navbar />
                            <ResetPassword />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/category"
                    element={
                        <>
                            <Navbar />
                            <Category />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/book/:bookId"
                    element={
                        <>
                            <Navbar />
                            <BookDetail />
                            <Footer />
                        </>
                    }
                />
                <Route
                    path="/user/:userId"
                    element={
                        <>
                            <Navbar />
                            <UserProfile />
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/admin/*"
                    element={
                        <AuthenticatedRoute>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <>
                                            <Navbar />
                                            <div className="">
                                                <AdminSideBar />
                                                <div className="ml-64">
                                                    <Admin />
                                                    <Footer />
                                                </div>
                                            </div>
                                        </>
                                    }
                                />
                                <Route
                                    path="/book"
                                    element={
                                        <>
                                            <Navbar />
                                            <AdminSideBar />
                                            <div className="ml-64">
                                                <BookTable />
                                                <Footer />
                                            </div>
                                        </>
                                    }
                                />
                                <Route
                                    path="/book/:bookId"
                                    element={
                                        <>
                                            <Navbar />
                                            <AdminSideBar />
                                            <div className="ml-64 mt-20">
                                                <AdminBookDetail />
                                                <Footer />
                                            </div>
                                        </>
                                    }
                                />
                            </Routes>
                        </AuthenticatedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
