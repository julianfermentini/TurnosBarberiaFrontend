import { tokenManager } from "./auth"

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// API client with authentication
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = tokenManager.getToken()

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      // Handle token expiration
      if (response.status === 401) {
        const refreshToken = tokenManager.getRefreshToken()
        if (refreshToken) {
          try {
            const refreshResponse = await fetch(`${this.baseURL}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            })

            if (refreshResponse.ok) {
              const { token: newToken } = await refreshResponse.json()
              tokenManager.setToken(newToken)

              // Retry original request with new token
              config.headers = {
                ...config.headers,
                Authorization: `Bearer ${newToken}`,
              }
              const retryResponse = await fetch(url, config)
              if (!retryResponse.ok) {
                throw new Error(`HTTP error! status: ${retryResponse.status}`)
              }
              return retryResponse.json()
            }
          } catch (refreshError) {
            tokenManager.clearTokens()
            window.location.href = "/"
            throw new Error("Session expired")
          }
        } else {
          tokenManager.clearTokens()
          window.location.href = "/"
          throw new Error("Authentication required")
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

// Barbershop API endpoints
export const barbershopApi = {
  getAll: () => apiClient.get<any[]>("/barbershops"),
  getById: (id: string) => apiClient.get<any>(`/barbershops/${id}`),
}

// Barber API endpoints
export const barberApi = {
  getByBarbershop: (barbershopId: string) => apiClient.get<any[]>(`/barbershops/${barbershopId}/barbers`),
  getById: (id: string) => apiClient.get<any>(`/barbers/${id}`),
}

// Service API endpoints
export const serviceApi = {
  getByBarber: (barberId: string) => apiClient.get<any[]>(`/barbers/${barberId}/services`),
  getAll: () => apiClient.get<any[]>("/services"),
}

// Appointment API endpoints
export const appointmentApi = {
  create: (data: any) => apiClient.post<any>("/appointments", data),
  getByUser: () => apiClient.get<any[]>("/appointments/user"),
  getById: (id: string) => apiClient.get<any>(`/appointments/${id}`),
  update: (id: string, data: any) => apiClient.put<any>(`/appointments/${id}`, data),
  cancel: (id: string) => apiClient.delete<any>(`/appointments/${id}`),
  getAvailableSlots: (barberId: string, date: string) =>
    apiClient.get<string[]>(`/barbers/${barberId}/available-slots?date=${date}`),
}

// User API endpoints
export const userApi = {
  getProfile: () => apiClient.get<any>("/users/profile"),
  updateProfile: (data: any) => apiClient.put<any>("/users/profile", data),
  getStats: () => apiClient.get<any>("/users/stats"),
}
