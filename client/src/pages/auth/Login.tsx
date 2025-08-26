import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/AuthButton";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/functions";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all required fields.");
            return false;
        }
        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }
        return true;
    };

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault(); 
        if (!validate()) return;

        try {
            setSubmitting(true); 
            await loginUser(email, password);
            navigate("/");
        } catch (err: any) {    
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Login failed. Please check your credentials.";
            toast.error(String(msg));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-48 p-6 border rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={onSubmit} noValidate>
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <Button
                    label={submitting ? "Logging in..." : "Login"}
                    onClick={() => {}}
                    disabled={submitting}
                />
                <button type="submit" className="hidden" aria-hidden />
            </form>
            <div className="flex justify-between mt-4 text-sm">
                <button
                    onClick={() => navigate("/auth/register")}
                    className="text-blue-500 hover:underline"
                    type="button"
                >
                    Do not have an account?
                </button>
                <button
                    onClick={() => navigate("/auth/forgot-password")}
                    className="text-blue-500 hover:underline"
                    type="button"
                >
                    Forgot Password?
                </button>
            </div>
        </div>
    );
};

export default Login;
