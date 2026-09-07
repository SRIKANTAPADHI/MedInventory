
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    // Logout
    async function logout() {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error(error);
            setError("Logout failed");
        }
    }

    // Fetch dashboard data
    useEffect(() => {
        async function fetchDashboard() {
            try {
                const response = await fetch("/api/dashboard");

                const result = await response.json();

                if (!response.ok) {
                    setError(
                        result.error || "Failed to load dashboard"
                    );
                    return;
                }

                setData(result);
            } catch (error) {
                console.error(error);
                setError("Something went wrong");
            }
        }

        fetchDashboard();
    }, []);

    // Error
    if (error) {
        return (
            <div className="p-8 text-red-500">
                {error}
            </div>
        );
    }

    // Loading
    if (!data) {
        return (
            <div className="p-8">
                Loading dashboard...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Medicine Inventory Management
                        </p>
                    </div>

                    <div className="flex gap-3">

                        <Link
                            href="/medicines"
                            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
                        >
                            View Medicines
                        </Link>

                        

                    </div>

                </div>

                {/* Dashboard Cards */}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Total Medicines */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Total Medicines
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            {data.totalMedicines}
                        </h2>
                    </div>

                    {/* Total Stock */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Total Stock
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            {data.totalStock}
                        </h2>
                    </div>

                    {/* Stock Value */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Stock Value
                        </p>

                        <h2 className="mt-2 text-3xl font-bold">
                            ₹{data.stockValue.toLocaleString("en-IN")}
                        </h2>
                    </div>

                    {/* Low Stock */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Low Stock
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-orange-500">
                            {data.lowStock}
                        </h2>
                    </div>

                    {/* Expiring Soon */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Expiring Soon
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-yellow-500">
                            {data.expiringSoon}
                        </h2>
                    </div>

                    {/* Expired */}
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Expired
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-red-500">
                            {data.expired}
                        </h2>
                    </div>

                </div>

                {/* Quick Actions */}

                <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-4 text-xl font-bold">
                        Quick Actions
                    </h2>

                    <div className="flex flex-wrap gap-3">

                        <Link
                            href="/medicines/add"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white flex justify-center items-center"
                        >
                            + Add Medicine
                        </Link>

                        <Link
                            href="/inventory"
                            className="rounded-lg bg-green-600 px-4 py-2 text-white flex justify-center items-center"
                        >
                            View Inventory
                        </Link>
                        <Link
                            href="/reports"
                            className="rounded-lg bg-purple-600 px-5 py-3 text-white"
                        >
                            View Reports
                        </Link>

                    </div>

                </div>

            </div>
        </main>
    );
}

