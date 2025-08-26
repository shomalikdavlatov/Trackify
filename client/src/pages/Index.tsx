import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Dashboard from "./dashboard/Dashboard";
import Transactions from "./dashboard/Transactions";
import Categories from "./dashboard/Categories";
import Settings from "./dashboard/Settings";

export default function Index() {
    return (
        <AppShell>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </AppShell>
    );
}
