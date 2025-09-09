"use client"

// Google OAuth configuration and utilities
export interface GoogleUser {
  sub: string
  email: string
  name: string
  picture?: string
  email_verified: boolean
}

export interface GoogleAuthConfig {
  clientId: string
  redirectUri: string
  scope: string
}

class GoogleAuthManager {
  private config: GoogleAuthConfig
  private isInitialized = false

  constructor() {
    this.config = {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      redirectUri: typeof window !== "undefined" ? `${window.location.origin}/api/auth/google/callback` : "",
      scope: "openid email profile",
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === "undefined") return

    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true

      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: this.config.clientId,
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
          })
          this.isInitialized = true
          resolve()
        } else {
          reject(new Error("Google Identity Services failed to load"))
        }
      }

      script.onerror = () => {
        reject(new Error("Failed to load Google Identity Services"))
      }

      document.head.appendChild(script)
    })
  }

  private async handleCredentialResponse(response: any) {
    try {
      // The response.credential contains the JWT token from Google
      const token = response.credential

      // Send to our backend for verification and user creation/login
      const authResponse = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      if (authResponse.ok) {
        const data = await authResponse.json()

        // Store tokens
        localStorage.setItem("auth_token", data.token)
        localStorage.setItem("refresh_token", data.refreshToken)

        // Redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        throw new Error("Authentication failed")
      }
    } catch (error) {
      console.error("Google authentication error:", error)
      throw error
    }
  }

  async signIn(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (window.google) {
      window.google.accounts.id.prompt()
    } else {
      throw new Error("Google Identity Services not initialized")
    }
  }

  renderSignInButton(
    element: HTMLElement,
    options?: {
      theme?: "outline" | "filled_blue" | "filled_black"
      size?: "large" | "medium" | "small"
      text?: "signin_with" | "signup_with" | "continue_with" | "signin"
      shape?: "rectangular" | "pill" | "circle" | "square"
      width?: number
    },
  ): void {
    if (!this.isInitialized || !window.google) {
      console.error("Google Identity Services not initialized")
      return
    }

    window.google.accounts.id.renderButton(element, {
      theme: options?.theme || "outline",
      size: options?.size || "large",
      text: options?.text || "signin_with",
      shape: options?.shape || "rectangular",
      width: options?.width || 250,
    })
  }

  async signOut(): Promise<void> {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect()
    }

    // Clear local tokens
    localStorage.removeItem("auth_token")
    localStorage.removeItem("refresh_token")
  }
}

export const googleAuth = new GoogleAuthManager()

// Type declarations for Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: () => void
          renderButton: (element: HTMLElement, options: any) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}
