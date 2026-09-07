"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditMedicinePage() {

  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    genericName: "",
    category: "",
    manufacturer: "",
    batchNumber: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
    minimumStock: "",
    expiryDate: "",
  });


  // Get medicine
  useEffect(() => {

    if (!id) return;

    async function fetchMedicine() {

      try {

        const response = await fetch(
          `/api/medicines/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Medicine not found");
          return;
        }

        setForm({
          name: data.name || "",
          genericName: data.genericName || "",
          category: data.category || "",
          manufacturer: data.manufacturer || "",
          batchNumber: data.batchNumber || "",

          purchasePrice:
            data.purchasePrice || "",

          sellingPrice:
            data.sellingPrice || "",

          quantity:
            data.quantity || "",

          minimumStock:
            data.minimumStock || "",

          expiryDate: data.expiryDate
            ? new Date(data.expiryDate)
                .toISOString()
                .split("T")[0]
            : "",
        });

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    }

    fetchMedicine();

  }, [id]);


  function handleChange(event) {

    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  }


  async function handleSubmit(event) {

    event.preventDefault();

    try {

      const response = await fetch(
        `/api/medicines/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(
          data.error ||
          "Failed to update medicine"
        );

        return;
      }

      alert("Medicine updated successfully");

      router.push("/medicines");

    } catch (error) {

      console.error(error);

      alert("Something went wrong");

    }

  }


  if (loading) {

    return (
      <div className="p-8">
        Loading medicine...
      </div>
    );

  }


  return (

    <main className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-3xl">

        <h1 className="mb-2 text-3xl font-bold">
          Edit Medicine
        </h1>

        <p className="mb-8 text-gray-500">
          Update medicine information
        </p>


        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl bg-white p-8 shadow"
        >

          <input
            name="name"
            placeholder="Medicine Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />


          <input
            name="genericName"
            placeholder="Generic Name"
            value={form.genericName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />


          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          >

            <option value="">
              Select Category
            </option>

            <option value="Pain Relief">
              Pain Relief
            </option>

            <option value="Antibiotic">
              Antibiotic
            </option>

            <option value="Vitamin">
              Vitamin
            </option>

            <option value="Antacid">
              Antacid
            </option>

            <option value="Other">
              Other
            </option>

          </select>


          <input
            name="manufacturer"
            placeholder="Manufacturer"
            value={form.manufacturer}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />


          <input
            name="batchNumber"
            placeholder="Batch Number"
            value={form.batchNumber}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />


          <div className="grid grid-cols-2 gap-4">

            <input
              type="number"
              name="purchasePrice"
              placeholder="Purchase Price"
              value={form.purchasePrice}
              onChange={handleChange}
              min="0"
              required
              className="rounded-lg border p-3"
            />

            <input
              type="number"
              name="sellingPrice"
              placeholder="Selling Price"
              value={form.sellingPrice}
              onChange={handleChange}
              min="0"
              required
              className="rounded-lg border p-3"
            />

          </div>


          <div className="grid grid-cols-2 gap-4">

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
              min="0"
              required
              className="rounded-lg border p-3"
            />

            <input
              type="number"
              name="minimumStock"
              placeholder="Minimum Stock"
              value={form.minimumStock}
              onChange={handleChange}
              min="0"
              required
              className="rounded-lg border p-3"
            />

          </div>


          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3"
          />


          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
          >
            Update Medicine
          </button>

        </form>

      </div>

    </main>

  );
}