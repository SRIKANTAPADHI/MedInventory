import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    // Get token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify JWT
    const decoded = verifyToken(token);

    if (!decoded) {
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get user from MongoDB
    const client = await clientPromise;
    const db = client.db("medicine_inventory");

    const user = await db.collection("users").findOne(
      {
        _id: new ObjectId(decoded.userId),
      },
      {
        projection: {
          password: 0,
        },
      }
    );

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);

    return Response.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}