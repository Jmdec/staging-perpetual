import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* =========================
   CREATE JUANTAP PROFILE
   POST /api/juantap
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_URL}/juantap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "", // forward cookies for session auth
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("POST /api/juantap error:", error);
    return NextResponse.json(
      { message: "Failed to create JuanTap profile" },
      { status: 500 }
    );
  }
}

/* =========================
   UPDATE JUANTAP PROFILE
   PUT /api/juantap
========================= */
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_URL}/juantap`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("PUT /api/juantap error:", error);
    return NextResponse.json(
      { message: "Failed to update JuanTap profile" },
      { status: 500 }
    );
  }
}
