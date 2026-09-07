"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Settings,
  ArrowLeft,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.user) {
          router.push("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Failed to load profile:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [router]);

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading profile...
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 pb-24 md:px-8 md:pb-8">

      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>


        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account information
          </p>
        </div>


        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Profile Header */}
          <div className="bg-blue-600 px-5 py-8 md:px-8">

            <div className="flex flex-col items-center gap-4 sm:flex-row">

              {/* Avatar */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg">
                <User size={45} />
              </div>

              {/* User Name */}
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {user.name || "User"}
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  Medicine Inventory User
                </p>
              </div>

            </div>

          </div>


          {/* Account Information */}
          <div className="p-5 md:p-8">

            <h3 className="mb-5 text-lg font-bold text-gray-800">
              Account Information
            </h3>


            {/* Name */}
            <div className="mb-4 flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <User size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400">
                  Full Name
                </p>

                <p className="mt-1 truncate font-semibold text-gray-800">
                  {user.name || "Not available"}
                </p>
              </div>

            </div>


            {/* Email */}
            <div className="mb-4 flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Mail size={20} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400">
                  Email Address
                </p>

                <p className="mt-1 truncate font-semibold text-gray-800">
                  {user.email || "Not available"}
                </p>
              </div>

            </div>


            {/* Account Status */}
            <div className="mb-6 flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-xs font-medium text-gray-400">
                  Account Status
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                  <p className="font-semibold text-green-600">
                    Active
                  </p>
                </div>
              </div>

            </div>


            {/* Actions */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* Settings */}
              <button
                onClick={() => router.push("/settings")}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Settings size={18} />
                Settings
              </button>


              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
              >
                <LogOut size={18} />
                Logout
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}