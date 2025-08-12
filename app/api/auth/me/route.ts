import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;
    console.log("Token: ", token);

    console.log("00000-11111");
    if (!token) {
      console.log("00000-22222222");

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("00000-33333333333");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    console.log("00000-444444444");

    return NextResponse.json({
      email: decoded.email,
      role: decoded.role,
      fullName: decoded.fullName,
    });
  } catch (error) {
    console.log("00000-5555555555");

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
