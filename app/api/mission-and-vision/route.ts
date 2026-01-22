import { type NextRequest, NextResponse } from "next/server"
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

async function getAuthToken() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    return token
  } catch (error) {
    console.error("[Auth] Error getting token:", error)
    return null
  }
}

function logError(method: string, error: any, url: string) {
  console.error(`[Mission&Vision API] ${method} - Error:`, {
    message: error.message,
    url,
    stack: error.stack,
    cause: error.cause
  })
}

export async function GET(request: NextRequest) {
  try {
    console.log("[Mission&Vision API] GET - Starting request")

    const token = await getAuthToken()
    console.log("[Mission&Vision API] GET - Token exists:", !!token)

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Use the admin endpoint for authenticated requests
    const url = `${API_URL}/mission-and-vision/admin`
    console.log("[Mission&Vision API] GET - Fetching from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      cache: "no-store",
    })

    const responseText = await response.text()
    console.log("[Mission&Vision API] GET - Response status:", response.status)
    console.log("[Mission&Vision API] GET - Response preview:", responseText.substring(0, 200))

    if (!response.ok) {
      console.error("[Mission&Vision API] GET - Request failed with status:", response.status)
      
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to fetch mission and vision data from server",
            rawResponse: responseText.substring(0, 200)
          },
          { status: response.status }
        )
      }
      
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to fetch mission and vision data",
          details: errorData.errors || errorData,
        },
        { status: response.status },
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("[Mission&Vision API] GET - JSON parse error:", parseError)
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid JSON response from server",
          rawResponse: responseText.substring(0, 200)
        },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    logError("GET", error, `${API_URL}/mission-and-vision/admin`)
    console.error("[Mission&Vision API] GET - Unexpected error:", error)

    const errorMessage = error instanceof TypeError && error.message.includes("fetch")
      ? "Cannot connect to Laravel backend. Please ensure it's running on " + API_URL
      : error instanceof Error
        ? error.message
        : "Unknown error"

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const url = `${API_URL}/mission-and-vision`

    console.log("[Mission&Vision API] POST - Sending to:", url)
    console.log("[Mission&Vision API] POST - Payload:", JSON.stringify(body, null, 2))

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(body),
    })

    const responseText = await response.text()
    console.log("[Mission&Vision API] POST - Status:", response.status)
    console.log("[Mission&Vision API] POST - Response:", responseText.substring(0, 500))

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "Server returned an error. Check Laravel logs for details.",
            isHtmlError: responseText.includes("<html") || responseText.includes("<!DOCTYPE"),
            rawResponse: responseText.substring(0, 200)
          },
          { status: response.status },
        )
      }
      
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to create mission and vision data",
          details: errorData.errors || errorData,
        },
        { status: response.status },
      )
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error) {
    logError("POST", error, `${API_URL}/mission-and-vision`)

    const errorMessage = error instanceof TypeError && error.message.includes("fetch")
      ? "Cannot connect to Laravel backend. Please ensure it's running on " + API_URL
      : error instanceof Error
        ? error.message
        : "Unknown error"

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const url = `${API_URL}/mission-and-vision`

    console.log("[Mission&Vision API] PUT - Sending to:", url)
    console.log("[Mission&Vision API] PUT - Payload:", JSON.stringify(body, null, 2))

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(body),
    })

    const responseText = await response.text()
    console.log("[Mission&Vision API] PUT - Status:", response.status)
    console.log("[Mission&Vision API] PUT - Response:", responseText.substring(0, 500))

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "Server returned an error. Check Laravel logs for details.",
            isHtmlError: responseText.includes("<html") || responseText.includes("<!DOCTYPE"),
            rawResponse: responseText.substring(0, 200)
          },
          { status: response.status },
        )
      }
      
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to update mission and vision data",
          details: errorData.errors || errorData,
        },
        { status: response.status },
      )
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error) {
    logError("PUT", error, `${API_URL}/mission-and-vision`)

    const errorMessage = error instanceof TypeError && error.message.includes("fetch")
      ? "Cannot connect to Laravel backend. Please ensure it's running on " + API_URL
      : error instanceof Error
        ? error.message
        : "Unknown error"

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = await getAuthToken()

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }

    const url = `${API_URL}/mission-and-vision`
    console.log("[Mission&Vision API] DELETE - Sending to:", url)

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    })

    const responseText = await response.text()
    console.log("[Mission&Vision API] DELETE - Status:", response.status)

    if (!response.ok) {
      let errorData
      try {
        errorData = JSON.parse(responseText)
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "Server returned an error. Check Laravel logs for details.",
            rawResponse: responseText.substring(0, 200)
          },
          { status: response.status },
        )
      }
      
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to delete mission and vision data",
          details: errorData.errors || errorData,
        },
        { status: response.status },
      )
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error) {
    logError("DELETE", error, `${API_URL}/mission-and-vision`)

    const errorMessage = error instanceof TypeError && error.message.includes("fetch")
      ? "Cannot connect to Laravel backend. Please ensure it's running on " + API_URL
      : error instanceof Error
        ? error.message
        : "Unknown error"

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}