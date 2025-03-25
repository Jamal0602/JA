"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePosts } from "@/context/post-context"
import PostModal from "@/components/post-modal"
import { formatDate } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function ProjectCarousel() {
  const { posts } = usePosts()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const goToPrevious = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex === posts.length - 1 ? 0 : prevIndex + 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      goToNext()
    } else if (touchEndX.current - touchStartX.current > 50) {
      goToPrevious()
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentIndex])

  // Auto-advance carousel for desktop only
  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        goToNext()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [currentIndex, isMobile])

  const selectedPostData = selectedPost ? posts.find((post) => post.id === selectedPost) : null

  return (
    <div className="relative w-full">
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {posts.map((post) => (
            <div key={post.id} className="w-full flex-shrink-0 px-4">
              <Card className="overflow-hidden h-full shadow-md hover:shadow-lg transition-shadow">
                <div className="relative aspect-video">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>{formatDate(post.date)}</span>
                    <span>•</span>
                    <span>{post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground line-clamp-2 mb-4">{post.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPost(post.id)}
                    className="flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    View Details
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
        onClick={goToPrevious}
        disabled={isAnimating}
        aria-label="Previous project"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
        onClick={goToNext}
        disabled={isAnimating}
        aria-label="Next project"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>

      <div className="flex justify-center mt-4 gap-2">
        {posts.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
            }`}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true)
                setCurrentIndex(index)
              }
            }}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {selectedPostData && (
        <PostModal post={selectedPostData} isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  )
}

