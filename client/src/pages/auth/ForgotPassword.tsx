import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import CodeInput from "../../components/CodeInput";
import { sendResetCode, resetPassword } from "../../api/auth";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);

    const handleSendCode = async () => {
        try {
            await sendResetCode(email);
            setCodeSent(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerifyCode = () => {
        // Normally verify code via API; here we just simulate
        if (code.length > 0) {
            setCodeVerified(true);
        }
    };

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await resetPassword(email, code, password);
            alert("Password reset successful!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-48 p-6 border rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {!codeSent && <Button label="Send Code" onClick={handleSendCode} />}
            {codeSent && !codeVerified && (
                <>
                    <CodeInput value={code} onChange={setCode} />
                    <Button label="Check Code" onClick={handleVerifyCode} />
                </>
            )}
            {codeVerified && (
                <>
                    <Input
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        label="Reset Password"
                        onClick={handleResetPassword}
                    />
                </>
            )}
        </div>
    );
};

export default ForgotPassword;
