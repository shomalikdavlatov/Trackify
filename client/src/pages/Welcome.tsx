import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { me } from "../api/auth";
import DashboardMock from "../components/landing/DashboardMock";
import MiniStat from "../components/landing/MiniStat";
import Feature from "../components/landing/Feature";

const Welcome = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await me();
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 text-slate-800 overflow-hidden">
            {/* Decorative background blobs */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-200/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-indigo-200/60 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />

            {/* NAVBAR */}
            <header className="relative z-10">
                <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
                            <span className="text-lg font-extrabold">T</span>
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-slate-900">
                            Trackify
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {isLoading ? (
                            <span className="text-slate-500">
                                Checking session…
                            </span>
                        ) : isLoggedIn ? (
                            <Link to="/dashboard">
                                <Button
                                    label="Go to Dashboard"
                                    variant="primary"
                                    className="px-5 py-2"
                                />
                            </Link>
                        ) : (
                            <>
                                <Link to="/auth/login">
                                    <Button
                                        label="Log In"
                                        variant="ghost"
                                        className="px-5 py-2"
                                    />
                                </Link>
                                <Link to="/auth/register">
                                    <Button
                                        label="Get Started"
                                        variant="primary"
                                        className="px-5 py-2"
                                    />
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            {/* HERO */}
            <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 pb-12 pt-4 md:grid-cols-2 md:gap-16 md:pb-20 lg:py-14">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 backdrop-blur">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        Secure. Private. Effortless.
                    </div>

                    <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
                        Own your money story with{" "}
                        <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                            crystal-clear insights
                        </span>
                        .
                    </h1>

                    <p className="mt-4 max-w-xl text-lg text-slate-600">
                        Track income and expenses, categorize transactions, and
                        visualize your habits. No spreadsheets, no stress—just
                        smart decisions made simple.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        {isLoading ? (
                            <div className="text-slate-500">
                                Loading actions…
                            </div>
                        ) : isLoggedIn ? (
                            <Link to="/dashboard">
                                <Button
                                    label="Open Dashboard"
                                    variant="primary"
                                    className="px-7 py-3 text-base"
                                />
                            </Link>
                        ) : (
                            <>
                                <Link to="/auth/register">
                                    <Button
                                        label="Create Free Account"
                                        variant="primary"
                                        className="px-7 py-3 text-base"
                                    />
                                </Link>
                                <Link to="/auth/login">
                                    <Button
                                        label="I already have an account"
                                        variant="ghost"
                                        className="px-7 py-3 text-base"
                                    />
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="mt-6 flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex -space-x-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-700 ring-2 ring-white">
                                ✓
                            </span>
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 ring-2 ring-white">
                                ✓
                            </span>
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-2 ring-white">
                                ✓
                            </span>
                        </div>
                        <span>
                            Bank-grade encryption • No ads • Cancel anytime
                        </span>
                    </div>
                </div>

                {/* Illustration card */}
                <div className="relative">
                    <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-sky-200 to-indigo-200 opacity-60 blur-2xl" />
                    <div className="relative rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-xl backdrop-blur">
                        <DashboardMock />
                    </div>
                    <div className="pointer-events-none absolute -bottom-6 -right-6 hidden rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-lg backdrop-blur md:block">
                        <MiniStat label="Savings Rate" value="32%" />
                    </div>
                    <div className="pointer-events-none absolute -top-4 -left-4 hidden rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-lg backdrop-blur md:block">
                        <MiniStat label="Monthly Net" value="+$642" />
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="relative z-10 border-t border-slate-200/70 bg-white/60 py-14 backdrop-blur">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-7 md:grid-cols-3">
                        <Feature
                            title="Smart Categorization"
                            description="Auto-group expenses with rules. See where every dollar goes without manual tagging."
                            icon={
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-700">
                                    💡
                                </span>
                            }
                        />
                        <Feature
                            title="Beautiful Reports"
                            description="Month-over-month trends, cash flow, and savings rate—always one click away."
                            icon={
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-700">
                                    📊
                                </span>
                            }
                        />
                        <Feature
                            title="Privacy First"
                            description="Your data is encrypted at rest and in transit. You’re always in control."
                            icon={
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                                    🔒
                                </span>
                            }
                        />
                    </div>
                </div>
            </section>

            {/* CTA STRIP */}
            <section className="relative z-10 py-14">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-indigo-600 to-sky-500 p-8 text-white shadow-xl md:p-10">
                        <div className="max-w-3xl">
                            <h2 className="text-2xl font-bold md:text-3xl">
                                Make smarter money moves in minutes—not months.
                            </h2>
                            <p className="mt-2 text-white/90">
                                Start tracking today and see your first insights
                                by tonight.
                            </p>
                            <div className="mt-6">
                                {isLoading ? (
                                    <div className="opacity-90">
                                        Preparing actions…
                                    </div>
                                ) : isLoggedIn ? (
                                    <Link to="/dashboard">
                                        <Button
                                            label="Go to Dashboard"
                                            variant="ghost"
                                            className="px-6 py-3 text-base bg-white/10 hover:bg-white/20"
                                        />
                                    </Link>
                                ) : (
                                    <Link to="/auth/register">
                                        <Button
                                            label="Create Free Account"
                                            variant="ghost"
                                            className="px-6 py-3 text-base bg-white/10 hover:bg-white/20"
                                        />
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="relative z-10 border-t border-slate-200/70 bg-white/60 py-8 text-sm text-slate-600 backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
                    <p>
                        © {new Date().getFullYear()} Trackify. All rights
                        reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="hover:text-slate-900">
                            Privacy
                        </Link>
                        <Link to="/terms" className="hover:text-slate-900">
                            Terms
                        </Link>
                        <a
                            href="mailto:support@trackify.app"
                            className="hover:text-slate-900"
                        >
                            Support
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
