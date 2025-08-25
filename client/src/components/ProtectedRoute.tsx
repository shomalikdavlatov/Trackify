import React, { useEffect, useState, useRef, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import {     me } from "../api/auth";
import { getUserData } from "../api/user";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const shownToastRef = useRef(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await me();
                const data = await getUserData();
                console.log(data.data);

                if (res.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    if (!shownToastRef.current) {
                        shownToastRef.current = true;
                        toast.error("You need to log in to access this page.", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: true,
                        });
                    }
                }
            } catch (err) {
                console.log(err);
                setIsAuthenticated(false);
                if (!shownToastRef.current) {
                    shownToastRef.current = true;
                    let message = "";
                    if ((err as Response).status === 401) {
                        message = "You need to log in to access this page!";
                    }
                    else {
                        message = "Network error. Please log in again!";
                    }
                        toast.error(message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: true,
                        });
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

    return children;
};

export default ProtectedRoute;
