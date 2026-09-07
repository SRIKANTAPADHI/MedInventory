"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Package,
  CalendarClock,
  XCircle,
  ArrowLeft,
  Pill,
} from "lucide-react";

export default function AlertsPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  async function fetchMedicines() {
    try {
      const response = await fetch("/api/medicines");
      const data = await response.json();

      setMedicines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load medicines:", error);
    } finally {
      setLoading(false);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysLater = new Date(today);
  thirtyDaysLater.setDate(today.getDate() + 30);

  // Low stock
  const lowStockMedicines = medicines.filter(
    (medicine) =>
      Number(medicine.quantity) <= Number(medicine.minimumStock)
  );

  // Expired
  const expiredMedicines = medicines.filter((medicine) => {
    const expiry = new Date(medicine.expiryDate);

    return expiry < today;
  });

  // Expiring within 30 days
  const expiringSoonMedicines = medicines.filter((medicine) => {
    const expiry = new Date(medicine.expiryDate);

    return expiry >= today && expiry <= thirtyDaysLater;
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading alerts...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 pb-24 md:px-8 md:pb-8">

      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Dashboard
        </Link>


        {/* Header */}
        <div className="mb-7">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <AlertTriangle size={25} />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Medicine Alerts
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Monitor low stock and medicine expiry
              </p>
            </div>

          </div>

        </div>


        {/* Alert Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">

          {/* Low Stock */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-yellow-700">
                  Low Stock
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-800">
                  {lowStockMedicines.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                <Package size={22} />
              </div>

            </div>

          </div>


          {/* Expiring Soon */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-orange-700">
                  Expiring Soon
                </p>

                <p className="mt-2 text-3xl font-bold text-orange-800">
                  {expiringSoonMedicines.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <CalendarClock size={22} />
              </div>

            </div>

          </div>


          {/* Expired */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm font-medium text-red-700">
                  Expired
                </p>

                <p className="mt-2 text-3xl font-bold text-red-800">
                  {expiredMedicines.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <XCircle size={22} />
              </div>

            </div>

          </div>

        </div>


        {/* Low Stock Section */}
        <AlertSection
          title="Low Stock Medicines"
          description="These medicines have reached their minimum stock level."
          icon={<Package size={20} />}
          iconClass="bg-yellow-100 text-yellow-600"
          medicines={lowStockMedicines}
          type="low"
        />


        {/* Expiring Soon */}
        <AlertSection
          title="Expiring Soon"
          description="Medicines that will expire within the next 30 days."
          icon={<CalendarClock size={20} />}
          iconClass="bg-orange-100 text-orange-600"
          medicines={expiringSoonMedicines}
          type="expiry"
        />


        {/* Expired */}
        <AlertSection
          title="Expired Medicines"
          description="These medicines have already expired."
          icon={<XCircle size={20} />}
          iconClass="bg-red-100 text-red-600"
          medicines={expiredMedicines}
          type="expired"
        />

      </div>

    </main>
  );
}


/* =====================================================
   ALERT SECTION
===================================================== */

function AlertSection({
  title,
  description,
  icon,
  iconClass,
  medicines,
  type,
}) {
  return (
    <section className="mb-8">

      {/* Section Header */}
      <div className="mb-4 flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {title}
          </h2>

          <p className="text-xs text-gray-500">
            {description}
          </p>
        </div>

      </div>


      {/* No Alerts */}
      {medicines.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">

          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Pill size={23} />
          </div>

          <p className="font-semibold text-gray-700">
            No alerts
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Everything looks good.
          </p>

        </div>
      ) : (

        /* Medicine List */
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {medicines.map((medicine) => {

            const expiryDate = medicine.expiryDate
              ? new Date(medicine.expiryDate).toLocaleDateString()
              : "N/A";

            return (
              <div
                key={medicine._id}
                className="flex flex-col gap-4 border-b border-gray-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >

                {/* Medicine Info */}
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Pill size={20} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="font-semibold text-gray-800">
                      {medicine.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {medicine.genericName || "Generic name unavailable"}
                    </p>

                  </div>

                </div>


                {/* Details */}
                <div className="grid grid-cols-2 gap-5 sm:flex sm:items-center">

                  {/* Quantity */}
                  <div>
                    <p className="text-[11px] text-gray-400">
                      Quantity
                    </p>

                    <p
                      className={`font-semibold ${
                        type === "low"
                          ? "text-yellow-600"
                          : "text-gray-700"
                      }`}
                    >
                      {medicine.quantity}
                    </p>
                  </div>


                  {/* Minimum Stock */}
                  {type === "low" && (
                    <div>
                      <p className="text-[11px] text-gray-400">
                        Minimum
                      </p>

                      <p className="font-semibold text-gray-700">
                        {medicine.minimumStock}
                      </p>
                    </div>
                  )}


                  {/* Expiry */}
                  {(type === "expiry" || type === "expired") && (
                    <div>
                      <p className="text-[11px] text-gray-400">
                        Expiry
                      </p>

                      <p
                        className={`font-semibold ${
                          type === "expired"
                            ? "text-red-600"
                            : "text-orange-600"
                        }`}
                      >
                        {expiryDate}
                      </p>
                    </div>
                  )}


                  {/* Edit */}
                  <Link
                    href={`/medicines/edit/${medicine._id}`}
                    className="col-span-2 rounded-lg border border-gray-200 px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 sm:col-span-1"
                  >
                    View / Edit
                  </Link>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}