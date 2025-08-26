import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const link = ({ isActive }: { isActive: boolean }) =>
        `block px-4 py-2 rounded-xl text-sm ${
            isActive
                ? "bg-brand-50 text-brand-700"
                : "text-slate-600 hover:bg-slate-100"
        }`;
    return (
        <aside className="hidden md:block w-[var(--sidebar-w)] shrink-0 border-r bg-white h-screen sticky top-0 p-4">
            <div className="mb-6">
                <div className="text-xl font-bold text-brand-700">Trackify</div>
                <div className="text-xs text-slate-500">Finance Dashboard</div>
            </div>
            <nav className="space-y-1">
                <NavLink to="/dashboard" className={link}>
                    Dashboard
                </NavLink>
                <NavLink to="/transactions" className={link}>
                    Transactions
                </NavLink>
                <NavLink to="/categories" className={link}>
                    Categories
                </NavLink>
                <NavLink to="/settings" className={link}>
                    Settings
                </NavLink>
            </nav>
        </aside>
    );
}
