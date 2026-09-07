"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Pill,
  Package,
  ShoppingCart,
  BarChart3,
  LogIn,
  LogOut,
  User,
  AlertTriangle,
  Stethoscope,
  Plus,
  ChevronDown
} from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false)

    const links = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Medicines",
            href: "/medicines",
            icon: Pill,
        },
        {
            name: "Inventory",
            href: "/inventory",
            icon: Package,
        },
        {
            name: "Sales",
            href: "/sales",
            icon: ShoppingCart,
        },
        {
            name: "Reports",
            href: "/reports",
            icon: BarChart3,
        },
    ];

    // Check login status
    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("/api/auth/me");

                setLoggedIn(response.ok);
            } catch (error) {
                console.error(error);
                setLoggedIn(false);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [pathname]);

    // Logout
    async function logout() {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });

            setLoggedIn(false);

            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">

            {/* Top Section */}

            <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">

                {/* Logo */}

                <Link
                    href={loggedIn ? "/dashboard" : "/"}
                    className="group flex shrink-0 items-center gap-3"
                >
                    {/* Medical Logo */}
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-200 transition group-hover:scale-105">

                        {/* Stethoscope */}
                        <Stethoscope
                            size={25}
                            strokeWidth={2.2}
                            className="text-white"
                        />

                        {/* Medical Plus */}
                        <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm">
                            <Plus
                                size={12}
                                strokeWidth={3}
                                className="text-blue-600"
                            />
                        </div>

                    </div>

                    <div >
                        <h1 className="text-lg font-bold text-gray-900">
                            Med
                            <span className="text-blue-600">
                                Inventory
                            </span>
                        </h1>

                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                            Management System
                        </p>
                    </div>
                </Link>

                {/* Login / Logout */}

                {/* Login / User Profile */}

                {!loading && (
                    <>
                        {loggedIn ? (
                            <div className="relative">

                                {/* User Profile Button */}
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 transition hover:bg-gray-50"
                                >
                                    {/* User Icon */}
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <User size={19} />
                                    </div>

                                    {/* User Text */}
                                    <div className="hidden text-left sm:block">
                                        <p className="text-sm font-semibold text-gray-800">
                                            User
                                        </p>

                                        <p className="text-[11px] text-gray-400">
                                            My Account
                                        </p>
                                    </div>

                                    <ChevronDown
                                        size={16}
                                        className={`text-gray-500 transition ${profileOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>


                                {/* Profile Dropdown */}
                                {profileOpen && (
                                    <div className="absolute right-0 top-14 z-[100] w-60 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

                                        {/* Account Header */}
                                        <div className="border-b border-gray-100 bg-gray-50 p-4">
                                            <div className="flex items-center gap-3">

                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                    <User size={22} />
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        My Account
                                                    </p>

                                                    <p className="text-xs text-gray-400">
                                                        Manage your account
                                                    </p>
                                                </div>

                                            </div>
                                        </div>


                                        {/* Profile */}
                                        <button
                                            onClick={() => {
                                                setProfileOpen(false);
                                                router.push("/profile");
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <User size={18} />

                                            <span>Profile</span>
                                        </button>


                                        {/* Settings */}
                                        <button
                                            onClick={() => {
                                                setProfileOpen(false);
                                                router.push("/alerts");
                                            }}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <AlertTriangle size={18} />

                                            <span>Medicine Alerts</span>
                                        </button>


                                        {/* Logout */}
                                        <button
                                            onClick={() => {
                                                setProfileOpen(false);
                                                logout();
                                            }}
                                            className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                        >
                                            <LogOut size={18} />

                                            <span>Logout</span>
                                        </button>

                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
                            >
                                <LogIn size={17} />

                                Login
                            </Link>
                        )}
                    </>
                )}
            </div>

            {/* Navigation */}

            {loggedIn && (
                <div className="border-t border-gray-100">

                    <div className="mx-auto max-w-7xl overflow-x-auto px-3 py-2 sm:px-6">

                        <div className="flex min-w-max items-center justify-center gap-1 rounded-xl bg-gray-50 p-1">

                            {links.map((link) => {
                                const active =
                                    pathname === link.href ||
                                    pathname.startsWith(
                                        `${link.href}/`
                                    );

                                const Icon = link.icon;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all sm:px-4 ${active
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                                : "text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                                            }`}
                                    >
                                        <Icon size={17} />

                                        <span>{link.name}</span>
                                    </Link>
                                );
                            })}

                        </div>

                    </div>

                </div>
            )}

        </nav>
    );
}