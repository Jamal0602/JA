"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Page } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface PageEditorProps {
  pageId?: string
  isNew?: boolean
}

export default function PageEditor({ pageId, isNew = false }: PageEditorProps) {
  const [page, setPage] = useState<Page>({
    id: "",
    title: "",
    slug: "",
    content: "",
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    meta: {
      description: "",
      keywords: "",
      ogImage: "",
    },
  })
  const [isLoading, setIsLoading] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (pageId && !isNew) {
      const fetchPage = async () => {
        try {
          // Fetch page data (implementation needed)
          // For now, we'll use mock data
          const mockPage: Page = {
            id: pageId,
            title: "Sample Page",
            slug: "sample-page",
            content: "<div><h1>Sample Page</h1><p>This is a sample page content.</p></div>",
            isPublished: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            meta: {
              description: "Sample page description",
              keywords: "sample, page, keywords",
              ogImage: "/placeholder.svg",
            },
          }

          setPage(mockPage)
        } catch (error) {
          console.error("Error fetching page:", error)
          toast({
            title: "Error",
            description: "Failed to load page",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }

      fetchPage()
    } else if (isNew) {
      setPage({
        id: uuidv4(),
        title: "",
        slug: "",
        content: "",
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        meta: {
          description: "",
          keywords: "",
          ogImage: "",
        },
      })
    }
  }, [pageId, isNew, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setPage((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof Page],
          [child]: value,
        },
      }))
    } else {
      setPage((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPage((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    setPage((prev) => ({ ...prev, slug: value }))
  }

  const generateSlug = () => {
    const slug = page.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    setPage((prev) => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Update the updatedAt timestamp
      const updatedPage = {
        ...page,
        updatedAt: new Date().toISOString(),
      }

      // Save page (implementation needed)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      toast({
        title: isNew ? "Page Created" : "Page Updated",
        description: isNew ? "Your page has been created successfully" : "Your page has been updated successfully",
      })

      router.push("/admin")
    } catch (error) {
      console.error("Error saving page:", error)
      toast({
        title: "Error",
        description: "Failed to save page",
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
        <h1 className="text-3xl font-bold">{isNew ? "Create New Page" : "Edit Page"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={page.title}
                  onChange={handleChange}
                  placeholder="Page title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">Page Slug</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={generateSlug} disabled={!page.title}>
                    Generate from title
                  </Button>
                </div>
                <Input
                  id="slug"
                  name="slug"
                  value={page.slug}
                  onChange={handleSlugChange}
                  placeholder="page-slug"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={page.isPublished}
                  onCheckedChange={(checked) => handleSwitchChange("isPublished", checked)}
                />
                <Label htmlFor="isPublished">Published</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="content">Page Content (HTML)</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={page.content}
                    onChange={handleChange}
                    placeholder="Page content in HTML format"
                    className="min-h-[400px] font-mono text-sm"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meta">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="meta.description">Meta Description</Label>
                  <Textarea
                    id="meta.description"
                    name="meta.description"
                    value={page.meta.description}
                    onChange={handleChange}
                    placeholder="Meta description for SEO"
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="meta.keywords">Meta Keywords</Label>
                  <Input
                    id="meta.keywords"
                    name="meta.keywords"
                    value={page.meta.keywords}
                    onChange={handleChange}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="meta.ogImage">Open Graph Image URL</Label>
                  <Input
                    id="meta.ogImage"
                    name="meta.ogImage"
                    value={page.meta.ogImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
                {isNew ? "Create Page" : "Update Page"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

