import { useState } from "react";
import Button from "../../components/ui/Button";
import CurrencySelect from "../../components/ui/CurrencySelect";
import Input from "../../components/Input";

export default function Settings() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currency, setCurrency] = useState("");
    
    const handleUpdatePassword: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
    }
    const handleUpdateCurrency: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
    }
    return (
        <div className="max-w-xl mx-auto space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-600 text-sm">
                    Manage your account preferences below.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4 border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                    Change Password
                </h2>
                <form className="space-y-4" onSubmit={handleUpdatePassword}>
                    <Input
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setCurrentPassword(e.target.value)
                        }
                        required
                    />
                    <Input
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewPassword(e.target.value)
                        }
                        required
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setConfirmPassword(e.target.value)
                        }
                        required
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        label="Update Password"
                    />
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 space-y-4 border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                    Currency
                </h2>
                <form onSubmit={handleUpdateCurrency}>
                    <CurrencySelect
                        value={currency}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setCurrency(e.target.value)
                        }
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        label="Save Currency"
                    />
                </form>
            </div>
        </div>
    );
}
