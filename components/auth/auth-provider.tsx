"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, tokenManager } from "@/lib/auth"
import { userApi } from "@/lib/api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const token = tokenManager.getToken()
      if (!token) {
        setUser(null)
        return
      }

      const userData = await userApi.getProfile()
      setUser(userData)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      tokenManager.clearTokens()
      setUser(null)
    }
  }

  const logout = () => {
    tokenManager.clearTokens()
    setUser(null)
    window.location.href = "/"
  }

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      await refreshUser()
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
