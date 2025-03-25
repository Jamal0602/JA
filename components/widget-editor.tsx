"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import type { Widget } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface WidgetEditorProps {
  widgetId?: string
  isNew?: boolean
}

export default function WidgetEditor({ widgetId, isNew = false }: WidgetEditorProps) {
  const [widget, setWidget] = useState<Widget>({
    id: "",
    name: "",
    type: "html",
    content: "",
    position: "sidebar",
    order: 0,
    isActive: true,
  })
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (widgetId && !isNew) {
      const fetchWidget = async () => {
        try {
          // Fetch widget data (implementation needed)
          // For now, we'll use mock data
          const mockWidget: Widget = {
            id: widgetId,
            name: "Sample Widget",
            type: "html",
            content: "<div>Sample content</div>",
            position: "sidebar",
            order: 1,
            isActive: true,
          }

          setWidget(mockWidget)
        } catch (error) {
          console.error("Error fetching widget:", error)
          toast({
            title: "Error",
            description: "Failed to load widget",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchWidget()
    } else if (isNew) {
      setWidget({
        id: uuidv4(),
        name: "",
        type: "html",
        content: "",
        position: "sidebar",
        order: 0,
        isActive: true,
      })
    }
  }, [widgetId, isNew, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWidget((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setWidget((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setWidget((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Save widget (implementation needed)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: isNew ? "Widget Created" : "Widget Updated",
        description: isNew ? "Your widget has been created successfully" : "Your widget has been updated successfully",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Error saving widget:", error)
      toast({
        title: "Error",
        description: "Failed to save widget",
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
        <h1 className="text-3xl font-bold">{isNew ? "Create New Widget" : "Edit Widget"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Widget Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={widget.name}
                  onChange={handleChange}
                  placeholder="Widget name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Widget Type</Label>
                <Select value={widget.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select widget type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="recent-posts">Recent Posts</SelectItem>
                    <SelectItem value="social-links">Social Links</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="position">Widget Position</Label>
                <Select value={widget.position} onValueChange={(value) => handleSelectChange("position", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select widget position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="homepage">Homepage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={widget.order.toString()}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Widget Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={widget.content}
                  onChange={handleChange}
                  placeholder="Widget content"
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={widget.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Active</Label>
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
                {isNew ? "Create Widget" : "Update Widget"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

