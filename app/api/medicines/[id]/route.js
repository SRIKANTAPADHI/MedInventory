import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const DATABASE_NAME = "medicine_inventory";
const COLLECTION_NAME = "medicines";


// GET one medicine
export async function GET(request, { params }) {

  try {

    const { id } = await params;

    const client = await clientPromise;

    const db = client.db(DATABASE_NAME);

    const medicine = await db
      .collection(COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });


    if (!medicine) {
      return Response.json(
        { error: "Medicine not found" },
        { status: 404 }
      );
    }


    return Response.json(medicine);

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: "Failed to fetch medicine" },
      { status: 500 }
    );
  }
}


// UPDATE medicine
export async function PUT(request, { params }) {

  try {

    const { id } = await params;

    const data = await request.json();

    const client = await clientPromise;

    const db = client.db(DATABASE_NAME);


    const updateData = {
      name: data.name,
      genericName: data.genericName,
      category: data.category,
      manufacturer: data.manufacturer,
      batchNumber: data.batchNumber,

      purchasePrice: Number(data.purchasePrice),
      sellingPrice: Number(data.sellingPrice),

      quantity: Number(data.quantity),
      minimumStock: Number(data.minimumStock),

      expiryDate: new Date(data.expiryDate),

      updatedAt: new Date(),
    };


    const result = await db
      .collection(COLLECTION_NAME)
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updateData,
        }
      );


    if (result.matchedCount === 0) {

      return Response.json(
        { error: "Medicine not found" },
        { status: 404 }
      );

    }


    return Response.json({
      message: "Medicine updated successfully",
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: "Failed to update medicine" },
      { status: 500 }
    );
  }
}


// DELETE medicine
export async function DELETE(request, { params }) {

  try {

    const { id } = await params;

    const client = await clientPromise;

    const db = client.db(DATABASE_NAME);


    const result = await db
      .collection(COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(id),
      });


    if (result.deletedCount === 0) {

      return Response.json(
        { error: "Medicine not found" },
        { status: 404 }
      );

    }


    return Response.json({
      message: "Medicine deleted successfully",
    });

  } catch (error) {

    console.error(error);

    return Response.json(
      { error: "Failed to delete medicine" },
      { status: 500 }
    );
  }
}