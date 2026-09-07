
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchMedicines() {
    try {
      const response = await fetch("/api/medicines");

      const data = await response.json();

      setMedicines(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMedicine(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/medicines/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchMedicines();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchMedicines();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
          <p className="text-sm text-slate-500">
            Loading medicines...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-200">
                💊
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Medicines
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your medicine inventory
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/medicines/add"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            + Add Medicine
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">

                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Medicine
                  </th>

                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Manufacturer
                  </th>

                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Batch
                  </th>

                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Quantity
                  </th>

                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Price
                  </th>

                  <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>
                {medicines.map((medicine) => (
                  <tr
                    key={medicine._id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >

                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {medicine.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {medicine.genericName}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {medicine.category}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-slate-600">
                      {medicine.manufacturer}
                    </td>

                    <td className="p-4 text-sm text-slate-600">
                      {medicine.batchNumber}
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          medicine.quantity <= medicine.minimumStock
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {medicine.quantity}
                      </span>
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      ₹{medicine.sellingPrice}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">

                        <Link
                          href={`/medicines/edit/${medicine._id}`}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            deleteMedicine(medicine._id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {medicines.length === 0 && (
            <div className="p-12 text-center">
              <div className="mb-3 text-4xl">
                💊
              </div>

              <p className="font-medium text-slate-700">
                No medicines found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Add your first medicine to get started.
              </p>
            </div>
          )}

        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">

          {medicines.map((medicine) => (
            <div
              key={medicine._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >

              {/* Card Header */}
              <div className="flex items-start justify-between border-b border-slate-100 p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    💊
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-800">
                      {medicine.name}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      {medicine.genericName}
                    </p>
                  </div>

                </div>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {medicine.category}
                </span>

              </div>

              {/* Card Details */}
              <div className="grid grid-cols-2 gap-4 p-4">

                <div>
                  <p className="text-xs text-slate-400">
                    Manufacturer
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {medicine.manufacturer}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Batch Number
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {medicine.batchNumber}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Quantity
                  </p>

                  <p
                    className={`mt-1 text-sm font-bold ${
                      medicine.quantity <= medicine.minimumStock
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {medicine.quantity}

                    {medicine.quantity <= medicine.minimumStock && (
                      <span className="ml-2 text-xs font-medium">
                        Low Stock
                      </span>
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Selling Price
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    ₹{medicine.sellingPrice}
                  </p>
                </div>

              </div>

              {/* Actions */}
              <div className="flex gap-3 border-t border-slate-100 bg-slate-50 p-4">

                <Link
                  href={`/medicines/edit/${medicine._id}`}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  ✏️ Edit
                </Link>

                <button
                  onClick={() =>
                    deleteMedicine(medicine._id)
                  }
                  className="flex-1 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  🗑️ Delete
                </button>

              </div>

            </div>
          ))}

          {/* Empty State */}
          {medicines.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mb-3 text-4xl">
                💊
              </div>

              <p className="font-semibold text-slate-700">
                No medicines found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Add your first medicine to get started.
              </p>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

