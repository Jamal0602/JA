"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import type { Domain } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2, RefreshCw } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface DomainEditorProps {
  domainId?: string
  isNew?: boolean
}

export default function DomainEditor({ domainId, isNew = false }: DomainEditorProps) {
  const [domain, setDomain] = useState<Domain>({
    id: "",
    name: "",
    url: "",
    icon: "",
    description: "",
    isActive: true,
  })
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (domainId && !isNew) {
      const fetchDomain = async () => {
        try {
          // Fetch domain data (implementation needed)
          // For now, we'll use mock data
          const mockDomain: Domain = {
            id: domainId,
            name: "Cubiz Space",
            url: "https://cubiz.space",
            icon: "/placeholder.svg?height=32&width=32",
            description: "Main Cubiz website",
            isActive: true,
          }

          setDomain(mockDomain)
        } catch (error) {
          console.error("Error fetching domain:", error)
          toast({
            title: "Error",
            description: "Failed to load domain",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchDomain()
    } else if (isNew) {
      setDomain({
        id: uuidv4(),
        name: "",
        url: "",
        icon: "",
        description: "",
        isActive: true,
      })
    }
  }, [domainId, isNew, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDomain((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setDomain((prev) => ({ ...prev, [name]: checked }))
  }

  const fetchDomainInfo = async () => {
    if (!domain.url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to fetch information",
        variant: "destructive",
      })
      return
    }

    setIsFetching(true)
    try {
      // In a real implementation, you would call an API to fetch domain info
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate fetched data
      const url = new URL(domain.url.startsWith("http") ? domain.url : `https://${domain.url}`)
      const hostname = url.hostname

      setDomain((prev) => ({
        ...prev,
        name: prev.name || hostname.split(".")[0].charAt(0).toUpperCase() + hostname.split(".")[0].slice(1),
        icon: prev.icon || `/placeholder.svg?height=32&width=32`,
        description: prev.description || `Website at ${hostname}`,
      }))

      toast({
        title: "Information Fetched",
        description: "Domain information has been retrieved successfully",
      })
    } catch (error) {
      console.error("Error fetching domain info:", error)
      toast({
        title: "Error",
        description: "Failed to fetch domain information. Please check the URL.",
        variant: "destructive",
      })
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Ensure URL has protocol
      let url = domain.url
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`
        setDomain((prev) => ({ ...prev, url }))
      }

      // Save domain (implementation needed)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: isNew ? "Domain Added" : "Domain Updated",
        description: isNew ? "Your domain has been added successfully" : "Your domain has been updated successfully",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Error saving domain:", error)
      toast({
        title: "Error",
        description: "Failed to save domain",
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
        <h1 className="text-3xl font-bold">{isNew ? "Add New Domain" : "Edit Domain"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="url">Domain URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    name="url"
                    value={domain.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    required
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={fetchDomainInfo} disabled={isFetching}>
                    {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">Fetch Info</span>
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Domain Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={domain.name}
                  onChange={handleChange}
                  placeholder="Domain name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="icon">Icon URL</Label>
                <div className="flex gap-4 items-center">
                  <Input
                    id="icon"
                    name="icon"
                    value={domain.icon}
                    onChange={handleChange}
                    placeholder="https://example.com/favicon.ico"
                  />
                  {domain.icon && (
                    <div className="relative w-8 h-8 rounded overflow-hidden border">
                      <Image
                        src={domain.icon || "/placeholder.svg"}
                        alt="Icon Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={domain.description}
                  onChange={handleChange}
                  placeholder="Brief description of the domain"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={domain.isActive}
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
                {isNew ? "Adding..." : "Updating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNew ? "Add Domain" : "Update Domain"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

