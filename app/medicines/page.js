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

      const response = await fetch(
        `/api/medicines/${id}`,
        {
          method: "DELETE",
        }
      );

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
      <div className="p-10">
        Loading medicines...
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Medicines
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your medicine inventory
            </p>
          </div>

          <Link
            href="/medicines/add"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            + Add Medicine
          </Link>

        </div>


        {/* Table */}

        <div className="overflow-x-auto rounded-xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="p-4 text-left">
                  Medicine
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Manufacturer
                </th>

                <th className="p-4 text-left">
                  Batch
                </th>

                <th className="p-4 text-left">
                  Quantity
                </th>

                <th className="p-4 text-left">
                  Price
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {medicines.map((medicine) => (

                <tr
                  key={medicine._id}
                  className="border-t"
                >

                  <td className="p-4 font-medium">
                    {medicine.name}
                  </td>

                  <td className="p-4">
                    {medicine.category}
                  </td>

                  <td className="p-4">
                    {medicine.manufacturer}
                  </td>

                  <td className="p-4">
                    {medicine.batchNumber}
                  </td>

                  <td className="p-4">
                    {medicine.quantity}
                  </td>

                  <td className="p-4">
                    ₹{medicine.sellingPrice}
                  </td>

                  <td className="p-4">

                    <div className="flex gap-2">

                      <Link
                        href={`/medicines/edit/${medicine._id}`}
                        className="rounded bg-blue-500 px-3 py-2 text-sm text-white"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          deleteMedicine(medicine._id)
                        }
                        className="rounded bg-red-500 px-3 py-2 text-sm text-white"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {medicines.length === 0 && (

            <div className="p-10 text-center text-gray-500">
              No medicines found.
            </div>

          )}

        </div>

      </div>

    </div>
  );
}