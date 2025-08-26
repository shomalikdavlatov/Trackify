import React from "react";
import {
    Routes,
    Route,
    BrowserRouter,
} from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute"; 
import Index from "./pages/Index";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/login" element={<Login />} />
                <Route
                    path="/auth/forgot-password"
                    element={<ForgotPassword />}
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

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
            />
        </BrowserRouter>
    );
};

export default App;
