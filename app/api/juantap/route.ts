import { NextResponse } from "next/server"

export const runtime = "nodejs"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function proxy(req: Request, method: "POST" | "PUT") {
  const body = await req.json()
  const cookie = req.headers.get("cookie") ?? ""

  const res = await fetch(`${API_URL}/juantap`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json", // 🔥 CRITICAL
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  })

  const text = await res.text()

  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    console.error("Laravel returned non-JSON:", text)
    return NextResponse.json(
      { message: "Invalid backend response" },
      { status: 502 }
    )
  }

  return NextResponse.json(data, { status: res.status })
}

export async function POST(req: Request) {
  try {
    return await proxy(req, "POST")
  } catch (err) {
    console.error("POST /api/juantap error:", err)
    return NextResponse.json(
      { message: "JuanTap proxy failed" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    return await proxy(req, "PUT")
  } catch (err) {
    console.error("PUT /api/juantap error:", err)
    return NextResponse.json(
      { message: "JuanTap proxy failed" },
      { status: 500 }
    )
  }
}
