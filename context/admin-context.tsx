"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AdminContextType {
  isLoading: boolean
  loginWithPassword: (password: string) => Promise<boolean>
  loginWithPin: (pin: string) => Promise<boolean>
  logout: () => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  updatePin: (pin: string) => Promise<boolean>
  updateRecoveryEmails: (emails: string[]) => Promise<boolean>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const loginWithPassword = async (password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      router.push("/admin")
      return true
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid password. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithPin = async (pin: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      router.push("/admin")
      return true
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid PIN. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (!response.ok) {
        throw new Error("Failed to update password")
      }

      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      })
      return true
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update password. Please check your current password.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updatePin = async (pin: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/update-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      })

      if (!response.ok) {
        throw new Error("Failed to update PIN")
      }

      toast({
        title: "PIN Updated",
        description: "Your PIN has been updated successfully.",
      })
      return true
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update PIN.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateRecoveryEmails = async (emails: string[]) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/update-recovery-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      })

      if (!response.ok) {
        throw new Error("Failed to update recovery emails")
      }

      toast({
        title: "Recovery Emails Updated",
        description: "Your recovery emails have been updated successfully.",
      })
      return true
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update recovery emails.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminContext.Provider
      value={{
        isLoading,
        loginWithPassword,
        loginWithPin,
        logout,
        updatePassword,
        updatePin,
        updateRecoveryEmails,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}

