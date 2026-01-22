import { NextResponse } from "next/server"

export const GET = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vlogs`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ success: false, message: `Backend error: ${text}` }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error("API /vlogs error:", err)
    return NextResponse.json({ success: false, message: err.message || "Something went wrong" }, { status: 500 })
  }
}