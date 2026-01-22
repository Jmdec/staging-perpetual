import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:8000/api"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const formData = await request.formData()

    const newFormData = new FormData()
    newFormData.append("_method", "PUT")

    for (const [key, value] of formData.entries()) {
      newFormData.append(key, value)
    }

    const response = await fetch(
      `${API_URL}/admin/legitimacy/${id}`,
      {
        method: "POST", // Laravel spoofing
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken.value}`,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: newFormData,
      }
    )

    const contentType = response.headers.get("content-type")
    const data = contentType?.includes("application/json")
      ? await response.json()
      : null

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Invalid response from server" },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth_token")

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${API_URL}/admin/legitimacy/${id}`,
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
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
