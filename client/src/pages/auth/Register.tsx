import React, { useState } from "react";
import { registerUser, sendVerificationCode } from "../../api/auth";
import Input from "../../components/Input";
import Button from "../../components/Button";
import CodeInput from "../../components/CodeInput";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { validateEmail } from "../../utils/functions";

const Register: React.FC = () => {
    const [email, setEmail] = useState("");
    const [codeSent, setCodeSent] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [code, setCode] = useState("");

    const [sendingCode, setSendingCode] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSendCode = async () => {
        if (!email.trim()) {
            toast.error("Email is required.");
            return;
        }
        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        try {
            setSendingCode(true);
    
            await sendVerificationCode(email);
            setCodeSent(true);
            toast.success("Verification code sent to your email.");
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to send verification code.";
            toast.error(String(msg));
        } finally {
            setSendingCode(false);
        }
    };

    const validateRegister = () => {
        if (
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim() ||
            !code.trim()
        ) {
            toast.error("Please fill in all required fields.");
            return false;
        }
        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return false;
        }
        return true;
    };

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!codeSent) {  
            await handleSendCode();
            return;
        }
        if (!validateRegister()) return;

        try {
            setSubmitting(true);
    
            await registerUser(email, password, code);
            toast.success("Account created successfully!");
            navigate("/auth/login");
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "Registration failed. Please check your details.";
            toast.error(String(msg));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-48 p-6 border rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
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
                {!codeSent ? (
                    <Button
                        label={sendingCode ? "Sending..." : "Send Code"}
                        onClick={(e?: any) => {
                            e?.preventDefault?.();
                            handleSendCode();
                        }}
                        disabled={sendingCode}
                
                
                    />
                ) : (
                    <>
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <CodeInput value={code} onChange={setCode} />

                        <Button
                            label={submitting ? "Creating..." : "Register"}
                            onClick={() => {}}
                            disabled={submitting}
                    
                    
                        />
                        <button type="submit" className="hidden" aria-hidden />
                    </>
                )}
            </form>
            <div className="mt-4 text-sm text-center">
                <button
                    onClick={() => navigate("/auth/login")}
                    className="text-blue-500 hover:underline"
                    type="button"
                >
                    Already have an account?
                </button>
            </div>
        </div>
    );
};

export default Register;
