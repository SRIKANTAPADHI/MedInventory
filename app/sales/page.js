"use client";

import { useEffect, useState } from "react";

export default function SalesPage() {
  const [medicines, setMedicines] = useState([]);
  const [sales, setSales] = useState([]);

  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [customerName, setCustomerName] = useState("");

  const [loading, setLoading] = useState(false);

  async function fetchData() {
    try {
      const medicinesResponse = await fetch("/api/medicines");
      const medicinesData = await medicinesResponse.json();

      const salesResponse = await fetch("/api/sales");
      const salesData = await salesResponse.json();

      setMedicines(medicinesData);
      setSales(salesData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleSale(e) {
    e.preventDefault();

    if (!medicineId || !quantity) {
      alert("Please select medicine and quantity");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicineId,
          quantity,
          customerName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      alert("Medicine sold successfully");

      setMedicineId("");
      setQuantity("");
      setCustomerName("");

      fetchData();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-2 text-3xl font-bold">
          Medicine Sales
        </h1>

        <p className="mb-8 text-gray-500">
          Sell medicines and manage stock
        </p>

        {/* Sale Form */}

        <div className="mb-8 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-semibold">
            Sell Medicine
          </h2>

          <form
            onSubmit={handleSale}
            className="grid gap-4 md:grid-cols-2"
          >

            {/* Medicine */}

            <div>
              <label className="mb-2 block font-medium">
                Medicine
              </label>

              <select
                value={medicineId}
                onChange={(e) =>
                  setMedicineId(e.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                <option value="">
                  Select medicine
                </option>

                {medicines.map((medicine) => (
                  <option
                    key={medicine._id}
                    value={medicine._id}
                  >
                    {medicine.name} — Stock:{" "}
                    {medicine.quantity}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}

            <div>
              <label className="mb-2 block font-medium">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                className="w-full rounded-lg border p-3"
                placeholder="Enter quantity"
              />
            </div>

            {/* Customer */}

            <div>
              <label className="mb-2 block font-medium">
                Customer Name
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                className="w-full rounded-lg border p-3"
                placeholder="Customer name"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Sell Medicine"}
              </button>
            </div>

          </form>
        </div>

        {/* Sales History */}

        <div className="overflow-x-auto rounded-xl bg-white shadow">

          <div className="p-6">
            <h2 className="text-xl font-semibold">
              Sales History
            </h2>
          </div>

          <table className="w-full">

            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">
                  Medicine
                </th>

                <th className="p-4 text-left">
                  Customer
                </th>

                <th className="p-4 text-left">
                  Quantity
                </th>

                <th className="p-4 text-left">
                  Price
                </th>

                <th className="p-4 text-left">
                  Total
                </th>

                <th className="p-4 text-left">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>

              {sales.map((sale) => (
                <tr
                  key={sale._id}
                  className="border-t"
                >
                  <td className="p-4 font-medium">
                    {sale.medicineName}
                  </td>

                  <td className="p-4">
                    {sale.customerName}
                  </td>

                  <td className="p-4">
                    {sale.quantity}
                  </td>

                  <td className="p-4">
                    ₹{sale.sellingPrice}
                  </td>

                  <td className="p-4 font-semibold">
                    ₹{sale.totalAmount}
                  </td>

                  <td className="p-4">
                    {new Date(
                      sale.soldAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

          {sales.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No sales found.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}