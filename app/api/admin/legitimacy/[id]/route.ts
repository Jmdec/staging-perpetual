import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: number } }
): Promise<Response> {
  try {
    const { id } = await params

    console.log("API PARAM ID:", id)

    if (!id) {
      return NextResponse.json(
        { success: false, message: `Invalid legitimacy ID ${id}` },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const formData = await request.formData()

    // Laravel method spoofing
    formData.append("_method", "PUT")

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/legitimacy/${id}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken.value}`,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
      }
    )

    const text = await response.text()

    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("NEXT API ERROR:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

/* ===================== DELETE ===================== */

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid legitimacy ID" },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/legitimacy/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken.value}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
