import clientPromise from "@/lib/mongodb";

const DATABASE_NAME = "medicine_inventory";
const COLLECTION_NAME = "medicines";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db(DATABASE_NAME);

    const medicines = await db
      .collection(COLLECTION_NAME)
      .find({})
      .toArray();

    // Total number of medicines
    const totalMedicines = medicines.length;

    // Total quantity
    const totalStock = medicines.reduce(
      (total, medicine) =>
        total + (medicine.quantity || 0),
      0
    );

    // Total purchase value of current stock
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
        medicine.quantity <=
        medicine.minimumStock
    ).length;

    // Today's date
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    // 30 days from today
    const thirtyDaysLater = new Date(today);

    thirtyDaysLater.setDate(
      thirtyDaysLater.getDate() + 30
    );

    // Expiring within 30 days
    const expiringSoon = medicines.filter(
      (medicine) => {
        const expiry = new Date(
          medicine.expiryDate
        );

        return (
          expiry >= today &&
          expiry <= thirtyDaysLater
        );
      }
    ).length;

    // Already expired
    const expired = medicines.filter(
      (medicine) => {
        const expiry = new Date(
          medicine.expiryDate
        );

        return expiry < today;
      }
    ).length;

    return Response.json({
      totalMedicines,
      totalStock,
      stockValue,
      lowStock,
      expiringSoon,
      expired,
    });

  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    return Response.json(
      {
        error: "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}