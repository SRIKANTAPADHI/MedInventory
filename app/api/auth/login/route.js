import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";

const DATABASE_NAME = "medicine_inventory";

export async function POST(request) {
  try {
    const data = await request.json();

    const { email, password } = data;

    if (!email || !password) {
      return Response.json(
        {
          error: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);

    const user = await db.collection("users").findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return Response.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return Response.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    const token = createToken(user);

    const response = Response.json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });

    response.headers.append(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      {
        error: "Login failed",
      },
      { status: 500 }
    );
  }
}