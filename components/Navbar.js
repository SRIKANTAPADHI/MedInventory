
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
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

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

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">

        {/* Logo */}

        <Link
          href={loggedIn ? "/dashboard" : "/"}
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl shadow-md shadow-blue-200 transition group-hover:scale-105">
            💊
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-gray-900">
              Med<span className="text-blue-600">Inventory</span>
            </h1>

            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
              Management System
            </p>
          </div>
        </Link>


        {/* Navigation */}

        {loggedIn && (
          <div className="hidden items-center gap-1 rounded-xl bg-gray-50 p-1 md:flex">

            {links.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                  }`}
                >
                  <Icon size={17} />

                  {link.name}
                </Link>
              );
            })}

          </div>
        )}


        {/* Login / Logout */}

        {!loading && (
          <>
            {loggedIn ? (
              <button
                onClick={logout}
                className="group flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white hover:shadow-md"
              >
                <LogOut size={17} />

                <span className="hidden sm:inline">
                  Logout
                </span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 hover:shadow-lg"
              >
                <LogIn size={17} />

                Login
              </Link>
            )}
          </>
        )}

      </div>

    </nav>
  );
}

