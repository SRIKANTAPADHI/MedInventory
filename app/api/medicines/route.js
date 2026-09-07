import clientPromise from "@/lib/mongodb";

const DATABASE_NAME = "medicine_inventory";
const COLLECTION_NAME = "medicines";

// GET all medicine
export async function GET() {
    try {
        const client = await clientPromise;

        const db = client.db(DATABASE_NAME);

        const medicines = await db
            .collection(COLLECTION_NAME)
            .find({})
            .toArray();

        return Response.json(medicines);
    } catch (error) {
        console.error(error);

        return Response.json(
            { error: "Failed to fetch medicines" },
            { status: 500 }
        );
    }
}
// ADD medicine
export async function POST(request) {
    try {
        const client = await clientPromise;

        const db = client.db(DATABASE_NAME);

        const data = await request.json();

        const medicine = {
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

            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await db
            .collection(COLLECTION_NAME)
            .insertOne(medicine);

        return Response.json(
            {
                message: "Medicine added successfully",
                medicine: {
                    ...medicine,
                    _id: result.insertedId,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("POST medicine error:", error);

        return Response.json(
            { error: "Failed to add medicine" },
            { status: 500 }
        );
    }
}
