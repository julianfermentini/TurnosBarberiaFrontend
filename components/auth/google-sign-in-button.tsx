"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { googleAuth } from "@/lib/google-auth"

interface GoogleSignInButtonProps {
  onSuccess?: () => void
  onError?: (error: Error) => void
  disabled?: boolean
  className?: string
}

export function GoogleSignInButton({ onSuccess, onError, disabled, className }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [useCustomButton, setUseCustomButton] = useState(false)

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      try {
        await googleAuth.initialize()

        // Try to render the official Google button
        if (buttonRef.current && !disabled) {
          try {
            googleAuth.renderSignInButton(buttonRef.current, {
              theme: "outline",
              size: "large",
              text: "continue_with",
              shape: "rectangular",
              width: 250,
            })
          } catch (error) {
            console.warn("Failed to render Google button, falling back to custom button")
            setUseCustomButton(true)
          }
        }
      } catch (error) {
        console.error("Failed to initialize Google Auth:", error)
        setUseCustomButton(true)
        onError?.(error as Error)
      }
    }

    initializeGoogleAuth()
  }, [disabled, onError])

  const handleCustomSignIn = async () => {
    if (disabled || isLoading) return

    setIsLoading(true)
    try {
      await googleAuth.signIn()
      onSuccess?.()
    } catch (error) {
      console.error("Google sign-in error:", error)
      onError?.(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  if (useCustomButton) {
    return (
      <Button
        variant="outline"
        className={`w-full bg-transparent ${className}`}
        onClick={handleCustomSignIn}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Continuar con Google
      </Button>
    )
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div ref={buttonRef} className={disabled ? "opacity-50 pointer-events-none" : ""} />
    </div>
  )
}
