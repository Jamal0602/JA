"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import type { Notification } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface NotificationEditorProps {
  notificationId?: string
  isNew?: boolean
}

export default function NotificationEditor({ notificationId, isNew = false }: NotificationEditorProps) {
  const [notification, setNotification] = useState<Notification>({
    id: "",
    title: "",
    content: "",
    date: new Date().toISOString(),
    isRead: false,
    type: "info",
  })
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (notificationId && !isNew) {
      const fetchNotification = async () => {
        try {
          // Fetch notification data (implementation needed)
          // For now, we'll use mock data
          const mockNotification: Notification = {
            id: notificationId,
            title: "Sample Notification",
            content: "This is a sample notification content.",
            date: new Date().toISOString(),
            isRead: false,
            type: "info",
          }

          setNotification(mockNotification)
        } catch (error) {
          console.error("Error fetching notification:", error)
          toast({
            title: "Error",
            description: "Failed to load notification",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchNotification()
    } else if (isNew) {
      setNotification({
        id: uuidv4(),
        title: "",
        content: "",
        date: new Date().toISOString(),
        isRead: false,
        type: "info",
      })
    }
  }, [notificationId, isNew, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNotification((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNotification((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Update the date timestamp for new notifications
      if (isNew) {
        setNotification((prev) => ({
          ...prev,
          date: new Date().toISOString(),
        }))
      }

      // Save notification (implementation needed)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: isNew ? "Notification Created" : "Notification Updated",
        description: isNew
          ? "Your notification has been created successfully"
          : "Your notification has been updated successfully",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Error saving notification:", error)
      toast({
        title: "Error",
        description: "Failed to save notification",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
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
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{isNew ? "Create New Notification" : "Edit Notification"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Notification Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={notification.title}
                  onChange={handleChange}
                  placeholder="Notification title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Notification Type</Label>
                <Select value={notification.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Notification Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={notification.content}
                  onChange={handleChange}
                  placeholder="Notification content"
                  rows={5}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="link">Link (Optional)</Label>
                <Input
                  id="link"
                  name="link"
                  value={notification.link || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/page"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isNew ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNew ? "Create Notification" : "Update Notification"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

