// Authentication utilities and types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  role: "CLIENT" | "ADMIN"
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone: string
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    return response.json()
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Registration failed")
    }

    return response.json()
  },

  googleAuth: async (token: string): Promise<AuthResponse> => {
    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Google authentication failed")
    }

    return response.json()
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Token refresh failed")
    }

    return response.json()
  },
}

import Cookies from "js-cookie"

export const tokenManager = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null
    return Cookies.get("auth_token") || null
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return
    Cookies.set("auth_token", token, { expires: 7, path: "/" }) // Expires in 7 days
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("refresh_token")
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem("refresh_token", token)
  },

  clearTokens: (): void => {
    if (typeof window === "undefined") return
    Cookies.remove("auth_token", { path: "/" })
    localStorage.removeItem("refresh_token")
  },
}
