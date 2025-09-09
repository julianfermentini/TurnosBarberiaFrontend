import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ message: "Google token is required" }, { status: 400 })
    }

    // Forward the Google JWT token to the backend for verification
    const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ message: data.message || "Google authentication failed" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Google auth API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
