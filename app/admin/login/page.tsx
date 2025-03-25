"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAdmin } from "@/context/admin-context"
import { Lock, Key } from "lucide-react"

export default function AdminLoginPage() {
  const [password, setPassword] = useState("")
  const [pin, setPin] = useState("")
  const [tapCount, setTapCount] = useState(0)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const { toast } = useToast()
  const { loginWithPassword, loginWithPin, isLoading } = useAdmin()
  const router = useRouter()

  // Reset tap count after 3 seconds of inactivity
  useEffect(() => {
    if (tapCount > 0) {
      const timer = setTimeout(() => {
        setTapCount(0)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [tapCount])

  const handleSecretTap = () => {
    setTapCount((prev) => {
      const newCount = prev + 1
      if (newCount >= 5) {
        // Changed from 3 to 5 taps
        setShowLoginForm(true)
        return 0
      }
      return newCount
    })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await loginWithPassword(password)

    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      })
      router.push("/admin")
    }
  }

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await loginWithPin(pin)

    if (success) {
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      })
      router.push("/admin")
    }
  }

  if (!showLoginForm) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground">The page you are looking for does not exist.</p>
          <div className="mt-8 inline-block p-4 opacity-0" onClick={handleSecretTap}>
            {/* Hidden clickable area */}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Password</span>
              </TabsTrigger>
              <TabsTrigger value="pin" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>PIN</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password">
              <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="pin">
              <form onSubmit={handlePinSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">4-Digit PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter your 4-digit PIN"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    inputMode="numeric"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

