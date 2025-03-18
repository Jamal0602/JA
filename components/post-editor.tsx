"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { usePosts } from "@/context/post-context"
import type { Post } from "@/lib/types"
import { generateId } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"

interface PostEditorProps {
  postId?: string
  isNew?: boolean
}

export default function PostEditor({ postId, isNew = false }: PostEditorProps) {
  const { posts, addPost, updatePost, getPost } = usePosts()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState<Omit<Post, "id">>({
    title: "",
    description: "",
    content: "",
    image: "/placeholder.svg?height=400&width=600",
    date: new Date().toISOString().split("T")[0],
    category: "",
  })

  useEffect(() => {
    if (postId && !isNew) {
      const post = getPost(postId)
      if (post) {
        setFormData({
          title: post.title,
          description: post.description,
          content: post.content,
          image: post.image,
          date: post.date,
          category: post.category,
        })
      }
    }
  }, [postId, isNew, getPost])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isNew) {
      const newPost: Post = {
        id: generateId(),
        ...formData,
      }
      addPost(newPost)
      toast({
        title: "Post created",
        description: "Your post has been created successfully",
      })
    } else if (postId) {
      const updatedPost: Post = {
        id: postId,
        ...formData,
      }
      updatePost(updatedPost)
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully",
      })
    }

    router.push("/admin")
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{isNew ? "Create New Post" : "Edit Post"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Post title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the post"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Content (HTML)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Post content in HTML format"
                  className="min-h-[300px] font-mono text-sm"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="URL to the post image"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Post category"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {isNew ? "Create Post" : "Update Post"}
          </Button>
        </div>
      </form>
    </div>
  )
}

