"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchReports() {
    try {
      const response = await fetch("/api/reports");

      const data = await response.json();

      setReport(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        Loading reports...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="p-10">
        Failed to load reports.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-7xl">

        <h1 className="text-3xl font-bold">
          Reports
        </h1>

        <p className="mt-2 mb-8 text-gray-500">
          Medicine inventory and sales reports
        </p>

        {/* Statistics */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Total Revenue
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              ₹{report.totalRevenue}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Total Sales
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {report.totalSales}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Units Sold
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {report.totalUnitsSold}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Current Stock
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {report.totalStock}
            </h2>
          </div>

        </div>

        {/* Stock Value */}

        <div className="mt-6 rounded-xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Current Inventory Value
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            ₹{report.stockValue}
          </h2>

        </div>

        {/* Alerts */}

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* Low Stock */}

          <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="text-xl font-bold">
              ⚠️ Low Stock
            </h2>

            <p className="mt-2 text-3xl font-bold">
              {report.lowStock.length}
            </p>

            <div className="mt-4 space-y-2">

              {report.lowStock.map((medicine) => (
                <div
                  key={medicine._id}
                  className="rounded bg-gray-100 p-3"
                >
                  <p className="font-medium">
                    {medicine.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Stock: {medicine.quantity}
                  </p>
                </div>
              ))}

            </div>

          </div>

          {/* Expiring */}

          <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="text-xl font-bold">
              ⏰ Expiring Soon
            </h2>

            <p className="mt-2 text-3xl font-bold">
              {report.expiringSoon.length}
            </p>

            <div className="mt-4 space-y-2">

              {report.expiringSoon.map((medicine) => (
                <div
                  key={medicine._id}
                  className="rounded bg-gray-100 p-3"
                >
                  <p className="font-medium">
                    {medicine.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      medicine.expiryDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              ))}

            </div>

          </div>

          {/* Expired */}

          <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="text-xl font-bold">
              ❌ Expired
            </h2>

            <p className="mt-2 text-3xl font-bold">
              {report.expired.length}
            </p>

            <div className="mt-4 space-y-2">

              {report.expired.map((medicine) => (
                <div
                  key={medicine._id}
                  className="rounded bg-gray-100 p-3"
                >
                  <p className="font-medium">
                    {medicine.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      medicine.expiryDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}