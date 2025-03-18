"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Post } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface PostModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
}

export default function PostModal({ post, isOpen, onClose }: PostModalProps) {
  const [mounted, setMounted] = useState(false)

  // Handle escape key press
  useEffect(() => {
    setMounted(true)

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!mounted) return null

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-background border rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 bg-background/80 backdrop-blur-sm rounded-full"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="relative w-full aspect-video">
          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <span>{post.category}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-4">{post.title}</h2>

          <div
            className="prose prose-gray dark:prose-invert max-w-none prose-img:rounded-md prose-headings:font-bold prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  )
}

