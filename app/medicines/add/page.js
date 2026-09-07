
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMedicinePage() {
  const router = useRouter();

  const [scanning, setScanning] = useState(false);

  const [form, setForm] = useState({
    name: "",
    genericName: "",
    category: "",
    manufacturer: "",
    batchNumber: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
    minimumStock: "10",
    expiryDate: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function scanMedicine(event) {
    const image = event.target.files?.[0];

    if (!image) return;

    setScanning(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("/api/scan-medicine", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to scan image");
        return;
      }

      setForm((previous) => ({
        ...previous,
        ...data.medicine,
      }));

      alert(
        "Medicine information extracted successfully. Please verify the details."
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong while scanning.");
    } finally {
      setScanning(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to add medicine");
        return;
      }

      alert("Medicine added successfully!");
      router.push("/medicines");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-200">
              +
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Add Medicine
              </h1>

              <p className="text-sm text-slate-500">
                Add a new medicine to your inventory
              </p>
            </div>
          </div>
        </div>

        {/* AI Scanner */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

          {/* Scanner top */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl backdrop-blur">
                  📷
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    AI Medicine Scanner
                  </h2>

                  <p className="text-sm text-blue-100">
                    Automatically extract medicine details from an image
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                AI Powered
              </div>

            </div>
          </div>

          {/* Scanner body */}
          <div className="p-6">
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-blue-300 hover:bg-blue-50/40">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                {scanning ? "🔄" : "📸"}
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                {scanning
                  ? "Analyzing medicine..."
                  : "Scan your medicine package"}
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Upload an image or take a photo of the medicine package.
                The AI will try to identify the medicine and fill the form
                automatically.
              </p>

              <label
                className={`mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-md transition ${
                  scanning
                    ? "cursor-not-allowed bg-slate-400"
                    : "cursor-pointer bg-blue-600 shadow-blue-200 hover:-translate-y-0.5 hover:bg-blue-700"
                }`}
              >
                {scanning ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    📷
                    Scan Medicine
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={scanMedicine}
                  disabled={scanning}
                  className="hidden"
                />
              </label>

              <p className="mt-4 text-xs text-slate-400">
                Best results: clearly show the medicine name, batch number
                and expiry date.
              </p>

            </div>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

          {/* Form Header */}
          <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-bold text-slate-900">
              Medicine Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter or verify the medicine details below.
            </p>
          </div>

          <div className="space-y-8 p-6 sm:p-8">

            {/* Basic Information */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-blue-600" />

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Basic Information
                  </h3>

                  <p className="text-xs text-slate-400">
                    Medicine identification details
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Medicine Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Medicine Name
                  </label>

                  <input
                    name="name"
                    placeholder="e.g. Dolo 650"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Generic Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Generic Name
                  </label>

                  <input
                    name="genericName"
                    placeholder="e.g. Paracetamol"
                    value={form.genericName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Manufacturer
                  </label>

                  <input
                    name="manufacturer"
                    placeholder="e.g. Micro Labs"
                    value={form.manufacturer}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Batch */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Batch Number
                  </label>

                  <input
                    name="batchNumber"
                    placeholder="Enter batch number"
                    value={form.batchNumber}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

              </div>
            </section>

            {/* Pricing */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-emerald-500" />

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Pricing
                  </h3>

                  <p className="text-xs text-slate-400">
                    Purchase and selling price
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Purchase Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="purchasePrice"
                      placeholder="0.00"
                      value={form.purchasePrice}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Selling Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="sellingPrice"
                      placeholder="0.00"
                      value={form.sellingPrice}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* Inventory */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-orange-500" />

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Inventory
                  </h3>

                  <p className="text-xs text-slate-400">
                    Stock quantity and low-stock threshold
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    placeholder="Enter quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Minimum Stock
                  </label>

                  <input
                    type="number"
                    name="minimumStock"
                    placeholder="10"
                    value={form.minimumStock}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>

              </div>
            </section>

            {/* Expiry */}
            <section>
              <div className="mb-5 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-red-500" />

                <div>
                  <h3 className="font-semibold text-slate-800">
                    Expiry Information
                  </h3>

                  <p className="text-xs text-slate-400">
                    Medicine expiration date
                  </p>
                </div>
              </div>

              <div className="max-w-md">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Expiry Date
                </label>

                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-100"
                />
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end sm:px-8">

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              ✓ Add Medicine
            </button>

          </div>

        </form>

        {/* Bottom Note */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Please verify all AI-generated information before adding the
          medicine to your inventory.
        </p>

      </div>
    </div>
  );
}

