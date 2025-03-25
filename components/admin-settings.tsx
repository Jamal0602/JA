"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAdmin } from "@/context/admin-context"
import { getSettings, updateSettings } from "@/lib/data-service"
import type { Settings } from "@/lib/types"
import { Loader2, Save, Plus, Trash2 } from "lucide-react"

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    siteTitle: "",
    siteDescription: "",
    favicon: "",
    logo: "",
    googleAnalyticsId: "",
    googleAdsenseId: "",
    googleTagManagerId: "",
    recoveryEmails: ["ja.jamalasraf@gmail.com"],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const { toast } = useToast()
  const { updatePassword, updatePin, updateRecoveryEmails } = useAdmin()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings()
        if (data) {
          setSettings(data)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      await updateSettings(settings)
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirmation must match",
        variant: "destructive",
      })
      return
    }

    const success = await updatePassword(currentPassword, newPassword)

    if (success) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  const handlePinUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin !== confirmPin) {
      toast({
        title: "PINs do not match",
        description: "PIN and confirmation must match",
        variant: "destructive",
      })
      return
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits",
        variant: "destructive",
      })
      return
    }

    const success = await updatePin(pin)

    if (success) {
      setPin("")
      setConfirmPin("")
    }
  }

  const handleAddRecoveryEmail = () => {
    if (settings.recoveryEmails.length >= 3) {
      toast({
        title: "Maximum reached",
        description: "You can only have up to 3 recovery emails",
        variant: "destructive",
      })
      return
    }

    setSettings((prev) => ({
      ...prev,
      recoveryEmails: [...prev.recoveryEmails, ""],
    }))
  }

  const handleRemoveRecoveryEmail = (index: number) => {
    if (settings.recoveryEmails.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You must have at least one recovery email",
        variant: "destructive",
      })
      return
    }

    setSettings((prev) => ({
      ...prev,
      recoveryEmails: prev.recoveryEmails.filter((_, i) => i !== index),
    }))
  }

  const handleRecoveryEmailChange = (index: number, value: string) => {
    setSettings((prev) => ({
      ...prev,
      recoveryEmails: prev.recoveryEmails.map((email, i) => (i === index ? value : email)),
    }))
  }

  const handleSaveRecoveryEmails = async () => {
    // Validate emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const validEmails = settings.recoveryEmails.every((email) => emailRegex.test(email))

    if (!validEmails) {
      toast({
        title: "Invalid emails",
        description: "Please enter valid email addresses",
        variant: "destructive",
      })
      return
    }

    const success = await updateRecoveryEmails(settings.recoveryEmails)

    if (success) {
      await handleSaveSettings()
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
            <CardDescription>Basic information about your website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                name="siteTitle"
                value={settings.siteTitle}
                onChange={handleSettingsChange}
                placeholder="My Website"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Input
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleSettingsChange}
                placeholder="A brief description of your website"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                name="favicon"
                value={settings.favicon}
                onChange={handleSettingsChange}
                placeholder="https://example.com/favicon.ico"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                value={settings.logo}
                onChange={handleSettingsChange}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="integrations" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Google Integrations</CardTitle>
            <CardDescription>Connect your website with Google services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input
                id="googleAnalyticsId"
                name="googleAnalyticsId"
                value={settings.googleAnalyticsId}
                onChange={handleSettingsChange}
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="googleAdsenseId">Google AdSense ID</Label>
              <Input
                id="googleAdsenseId"
                name="googleAdsenseId"
                value={settings.googleAdsenseId || "pub-7483780622360467"}
                onChange={handleSettingsChange}
                placeholder="pub-XXXXXXXXXX"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
              <Input
                id="googleTagManagerId"
                name="googleTagManagerId"
                value={settings.googleTagManagerId}
                onChange={handleSettingsChange}
                placeholder="GTM-XXXXXXX"
              />
            </div>

            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Password Management</CardTitle>
            <CardDescription>Update your admin password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PIN Management</CardTitle>
            <CardDescription>Set or update your 4-digit PIN</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePinUpdate} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="pin">4-Digit PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPin">Confirm PIN</Label>
                <Input
                  id="confirmPin"
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Confirm 4-digit PIN"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                  required
                />
              </div>

              <Button type="submit">Update PIN</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recovery Emails</CardTitle>
            <CardDescription>Manage recovery email addresses (max 3)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.recoveryEmails.map((email, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={email}
                  onChange={(e) => handleRecoveryEmailChange(index, e.target.value)}
                  placeholder="Email address"
                  type="email"
                  required
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => handleRemoveRecoveryEmail(index)}
                  disabled={index === 0 && settings.recoveryEmails.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddRecoveryEmail}
                disabled={settings.recoveryEmails.length >= 3}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Email
              </Button>

              <Button type="button" onClick={handleSaveRecoveryEmails}>
                <Save className="mr-2 h-4 w-4" />
                Save Emails
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

