import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import Welcome from "./pages/Welcome";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/login" element={<Login />} />
                <Route
                    path="/auth/reset-password"
                    element={<ResetPassword />}
                />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <Index />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            <ToastContainer position="top-right" autoClose={5000} />
        </BrowserRouter>
    );
};

export default App;
