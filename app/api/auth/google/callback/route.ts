import { type NextRequest, NextResponse } from "next/server"

// This route handles the OAuth callback from Google (if needed for server-side flow)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      console.error("Google OAuth error:", error)
      return NextResponse.redirect(new URL("/?error=oauth_error", request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL("/?error=missing_code", request.url))
    }

    // Exchange code for tokens (if using server-side flow)
    // For client-side flow with Google Identity Services, this route may not be needed

    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("Google OAuth callback error:", error)
    return NextResponse.redirect(new URL("/?error=callback_error", request.url))
  }
}
