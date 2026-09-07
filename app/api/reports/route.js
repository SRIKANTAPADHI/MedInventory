import clientPromise from "@/lib/mongodb";

const DATABASE_NAME = "medicine_inventory";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);

    const medicines = await db
      .collection("medicines")
      .find({})
      .toArray();

    const sales = await db
      .collection("sales")
      .find({})
      .sort({ soldAt: -1 })
      .toArray();

    // Total revenue
    const totalRevenue = sales.reduce(
      (total, sale) => total + (sale.totalAmount || 0),
      0
    );

    // Total units sold
    const totalUnitsSold = sales.reduce(
      (total, sale) => total + (sale.quantity || 0),
      0
    );

    // Current stock
    const totalStock = medicines.reduce(
      (total, medicine) =>
        total + (medicine.quantity || 0),
      0
    );

    // Stock value
    const stockValue = medicines.reduce(
      (total, medicine) =>
        total +
        (medicine.quantity || 0) *
          (medicine.purchasePrice || 0),
      0
    );

    // Low stock
    const lowStock = medicines.filter(
      (medicine) =>
        medicine.quantity <= medicine.minimumStock
    );

    // Expired
    const today = new Date();

    const expired = medicines.filter(
      (medicine) =>
        new Date(medicine.expiryDate) < today
    );

    // Expiring within 30 days
    const thirtyDays = new Date();
    thirtyDays.setDate(
      thirtyDays.getDate() + 30
    );

    const expiringSoon = medicines.filter((medicine) => {
      const expiry = new Date(medicine.expiryDate);

      return (
        expiry >= today &&
        expiry <= thirtyDays
      );
    });

    return Response.json({
      totalRevenue,
      totalUnitsSold,
      totalStock,
      stockValue,
      lowStock,
      expired,
      expiringSoon,
      totalSales: sales.length,
    });
  } catch (error) {
    console.error("Reports error:", error);

    return Response.json(
      {
        error: "Failed to load reports",
      },
      { status: 500 }
    );
  }
}