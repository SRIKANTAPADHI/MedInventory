"use client";

import { useEffect, useState } from "react";

export default function InventoryPage() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedicines() {
      try {
        const response = await fetch(
          "/api/medicines"
        );

        const data = await response.json();

        setMedicines(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMedicines();
  }, []);


  function getStockStatus(medicine) {
    if (
      medicine.quantity <=
      medicine.minimumStock
    ) {
      return "Low Stock";
    }

    return "In Stock";
  }


  function getExpiryStatus(expiryDate) {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);

    expiry.setHours(0, 0, 0, 0);

    if (expiry < today) {
      return "Expired";
    }

    const difference =
      expiry.getTime() -
      today.getTime();

    const days =
      difference /
      (1000 * 60 * 60 * 24);

    if (days <= 30) {
      return "Expiring Soon";
    }

    return "Normal";
  }


  const filteredMedicines =
    medicines.filter((medicine) => {

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        medicine.name
          .toLowerCase()
          .includes(searchText) ||
        medicine.genericName
          .toLowerCase()
          .includes(searchText) ||
        medicine.batchNumber
          .toLowerCase()
          .includes(searchText);


      if (!matchesSearch) {
        return false;
      }


      if (filter === "all") {
        return true;
      }


      if (filter === "low") {
        return (
          medicine.quantity <=
          medicine.minimumStock
        );
      }


      if (filter === "expiring") {
        return (
          getExpiryStatus(
            medicine.expiryDate
          ) === "Expiring Soon"
        );
      }


      if (filter === "expired") {
        return (
          getExpiryStatus(
            medicine.expiryDate
          ) === "Expired"
        );
      }


      return true;
    });


  if (loading) {
    return (
      <div className="p-8">
        Loading inventory...
      </div>
    );
  }


  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Inventory
          </h1>

          <p className="mt-2 text-gray-500">
            Monitor medicine stock and expiry
          </p>

        </div>


        {/* Search and Filter */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">

          <input
            type="text"
            placeholder="Search medicine, generic name or batch..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 rounded-lg border bg-white p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />


          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="rounded-lg border bg-white p-3"
          >

            <option value="all">
              All Medicines
            </option>

            <option value="low">
              Low Stock
            </option>

            <option value="expiring">
              Expiring Soon
            </option>

            <option value="expired">
              Expired
            </option>

          </select>

        </div>


        {/* Inventory Table */}

        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">

          <table className="w-full min-w-[900px]">

            <thead className="bg-gray-50">

              <tr>

                <th className="p-4 text-left">
                  Medicine
                </th>

                <th className="p-4 text-left">
                  Category
                </th>

                <th className="p-4 text-left">
                  Batch
                </th>

                <th className="p-4 text-left">
                  Quantity
                </th>

                <th className="p-4 text-left">
                  Stock Status
                </th>

                <th className="p-4 text-left">
                  Expiry Date
                </th>

                <th className="p-4 text-left">
                  Expiry Status
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredMedicines.map(
                (medicine) => {

                  const stockStatus =
                    getStockStatus(
                      medicine
                    );

                  const expiryStatus =
                    getExpiryStatus(
                      medicine.expiryDate
                    );

                  return (
                    <tr
                      key={medicine._id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="p-4">

                        <div className="font-medium">
                          {medicine.name}
                        </div>

                        <div className="text-sm text-gray-500">
                          {medicine.genericName}
                        </div>

                      </td>


                      <td className="p-4">
                        {medicine.category}
                      </td>


                      <td className="p-4">
                        {medicine.batchNumber}
                      </td>


                      <td className="p-4 font-medium">
                        {medicine.quantity}
                      </td>


                      <td className="p-4">

                        <span
                          className={
                            stockStatus ===
                            "Low Stock"
                              ? "font-medium text-red-500"
                              : "font-medium text-green-600"
                          }
                        >
                          {stockStatus}
                        </span>

                      </td>


                      <td className="p-4">
                        {new Date(
                          medicine.expiryDate
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </td>


                      <td className="p-4">

                        <span
                          className={
                            expiryStatus ===
                            "Expired"
                              ? "font-medium text-red-500"
                              : expiryStatus ===
                                "Expiring Soon"
                              ? "font-medium text-orange-500"
                              : "font-medium text-green-600"
                          }
                        >
                          {expiryStatus}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>


          {filteredMedicines.length === 0 && (

            <div className="p-10 text-center text-gray-500">
              No medicines found.
            </div>

          )}

        </div>

      </div>

    </main>
  );
}