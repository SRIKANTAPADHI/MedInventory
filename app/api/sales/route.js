import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DATABASE_NAME = "medicine_inventory";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);

    const sales = await db
      .collection("sales")
      .find({})
      .sort({ soldAt: -1 })
      .toArray();

    return Response.json(sales);
  } catch (error) {
    console.error("GET sales error:", error);

    return Response.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      medicineId,
      quantity,
      customerName,
    } = data;

    if (!medicineId || !quantity) {
      return Response.json(
        { error: "Medicine and quantity are required" },
        { status: 400 }
      );
    }

    const sellQuantity = Number(quantity);

    if (sellQuantity <= 0) {
      return Response.json(
        { error: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);

    // Find medicine
    const medicine = await db
      .collection("medicines")
      .findOne({
        _id: new ObjectId(medicineId),
      });

    if (!medicine) {
      return Response.json(
        { error: "Medicine not found" },
        { status: 404 }
      );
    }

    // Check stock
    if (medicine.quantity < sellQuantity) {
      return Response.json(
        {
          error: `Only ${medicine.quantity} units available`,
        },
        { status: 400 }
      );
    }

    const totalAmount =
      sellQuantity * medicine.sellingPrice;

    // Reduce stock
    await db.collection("medicines").updateOne(
      {
        _id: new ObjectId(medicineId),
      },
      {
        $inc: {
          quantity: -sellQuantity,
        },
        $set: {
          updatedAt: new Date(),
        },
      }
    );
    // expiryDate
const expiryDate = new Date(medicine.expiryDate);

if (expiryDate < new Date()) {
  return Response.json(
    {
      error: "Cannot sell expired medicine",
    },
    { status: 400 }
  );
}

    // Create sale
    const sale = {
      medicineId: new ObjectId(medicineId),
      medicineName: medicine.name,
      quantity: sellQuantity,
      sellingPrice: medicine.sellingPrice,
      totalAmount,
      customerName: customerName || "Walk-in Customer",
      soldAt: new Date(),
    };

    const result = await db
      .collection("sales")
      .insertOne(sale);

    return Response.json(
      {
        message: "Medicine sold successfully",
        sale: {
          ...sale,
          _id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST sale error:", error);

    return Response.json(
      { error: "Failed to create sale" },
      { status: 500 }
    );
  }
}