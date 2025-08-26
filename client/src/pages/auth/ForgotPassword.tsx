import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/AuthButton";
import CodeInput from "../../components/CodeInput";
import { sendResetCode, resetPassword, checkCode } from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/functions";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);

    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [sendingCode, setSendingCode] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    const getErr = (err: any) =>
        err?.response?.data?.message || err?.message || "Something went wrong.";

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
            await sendResetCode(email.trim());
            setCodeSent(true);
            toast.success("Verification code sent to your email.");
        } catch (err: any) {
            toast.error(String(getErr(err)));
        } finally {
            setSendingCode(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!code.trim()) {
            toast.error("Please enter the verification code.");
            return;
        }
        try {
            setVerifying(true);
            await checkCode(email.trim(), code.trim(), "reset");
            setCodeVerified(true);
            toast.success("Code verified. You can set a new password.");
        } catch (err: any) {
            toast.error(String(getErr(err)));
        } finally {
            setVerifying(false);
        }
    };

    const validateReset = () => {
        if (
            !email.trim() ||
            !code.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
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

    const handleResetPassword = async () => {
        if (!validateReset()) return;
        try {
            setSubmitting(true);
            await resetPassword(email.trim(), code.trim(), password);
            toast.success("Password reset successful! You can now log in.");
            setCode("");
            setPassword("");
            setConfirmPassword("");
            setCodeSent(false);
            setCodeVerified(false);
            navigate("/auth/login");
        } catch (err: any) {
            toast.error(String(getErr(err)));
        } finally {
            setSubmitting(false);
        }
    };

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!codeSent) {
            await handleSendCode();
        } else if (codeSent && !codeVerified) {
            await handleVerifyCode();
        } else {
            await handleResetPassword();
        }
    };

    return (
        <div className="max-w-md mx-auto mt-48 p-6 border rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

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

                {!codeSent && (
                    <Button
                        label={sendingCode ? "Sending..." : "Send Code"}
                        onClick={(e?: any) => {
                            e?.preventDefault?.();
                            handleSendCode();
                        }}
                        disabled={sendingCode}
                    />
                )}

                {codeSent && !codeVerified && (
                    <>
                        <CodeInput value={code} onChange={setCode} />
                        <Button
                            label={verifying ? "Checking..." : "Check Code"}
                            onClick={(e?: any) => {
                                e?.preventDefault?.();
                                handleVerifyCode();
                            }}
                            disabled={verifying}
                        />
                        <button type="submit" className="hidden" aria-hidden />
                    </>
                )}

                {codeVerified && (
                    <>
                        <Input
                            label="New Password"
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
                        <Button
                            label={
                                submitting ? "Resetting..." : "Reset Password"
                            }
                            onClick={() => {}}
                            disabled={submitting}
                        />
                        <button type="submit" className="hidden" aria-hidden />
                    </>
                )}
            </form>
        </div>
    );
};

export default ForgotPassword;
