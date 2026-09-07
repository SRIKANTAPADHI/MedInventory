import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const DATABASE_NAME = "medicine_inventory";

export async function POST(request) {
  try {
    const data = await request.json();

    const { name, email, password } = data;

    if (!name || !email || !password) {
      return Response.json(
        {
          error: "Name, email and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        {
          error: "Password must contain at least 6 characters",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);

    const existingUser = await db
      .collection("users")
      .findOne({
        email: email.toLowerCase(),
      });

    if (existingUser) {
      return Response.json(
        {
          error: "User already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await db
      .collection("users")
      .insertOne(user);

    return Response.json(
      {
        message: "Registration successful",
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);

    return Response.json(
      {
        error: "Registration failed",
      },
      { status: 500 }
    );
  }
}