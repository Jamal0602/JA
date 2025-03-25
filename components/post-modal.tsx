"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Heart, MessageSquare, Share2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import type { Post, Comment } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface PostModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
}

export default function PostModal({ post, isOpen, onClose }: PostModalProps) {
  const [mounted, setMounted] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes || 0)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState<Comment[]>([])
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [showSignup, setShowSignup] = useState(false)
  const { toast } = useToast()

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

  // Load comments
  useEffect(() => {
    // Simulate loading comments
    const mockComments: Comment[] = [
      {
        id: "1",
        postId: post.id,
        userId: "user1",
        userName: "John Doe",
        userEmail: "john@example.com",
        content: "Great post! I really enjoyed reading this.",
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "2",
        postId: post.id,
        userId: "user2",
        userName: "Jane Smith",
        userEmail: "jane@example.com",
        content: "Thanks for sharing this information. Very helpful!",
        date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      },
    ]

    setComments(mockComments)

    // Check if user has liked the post
    const likedPosts = localStorage.getItem("likedPosts")
    if (likedPosts) {
      const likedPostsArray = JSON.parse(likedPosts)
      setLiked(likedPostsArray.includes(post.id))
    }

    // Check if user info exists
    const storedUserName = localStorage.getItem("userName")
    const storedUserEmail = localStorage.getItem("userEmail")
    if (storedUserName) setUserName(storedUserName)
    if (storedUserEmail) setUserEmail(storedUserEmail)
  }, [post.id])

  const handleLike = () => {
    if (!userName || !userEmail) {
      setShowSignup(true)
      return
    }

    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1))

    // Save liked status
    const likedPosts = localStorage.getItem("likedPosts")
    let likedPostsArray = likedPosts ? JSON.parse(likedPosts) : []

    if (newLiked) {
      likedPostsArray.push(post.id)
    } else {
      likedPostsArray = likedPostsArray.filter((id: string) => id !== post.id)
    }

    localStorage.setItem("likedPosts", JSON.stringify(likedPostsArray))

    toast({
      title: newLiked ? "Post liked" : "Post unliked",
      description: newLiked ? "This post has been added to your likes" : "This post has been removed from your likes",
    })
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim()) return

    if (!userName || !userEmail) {
      setShowSignup(true)
      return
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      userId: userEmail,
      userName,
      userEmail,
      content: commentText,
      date: new Date().toISOString(),
    }

    setComments((prev) => [newComment, ...prev])
    setCommentText("")

    toast({
      title: "Comment added",
      description: "Your comment has been added successfully",
    })
  }

  const handleShare = () => {
    if (!userName || !userEmail) {
      setShowSignup(true)
      return
    }

    // Copy post URL to clipboard
    const url = `${window.location.origin}/post/${post.id}`
    navigator.clipboard.writeText(url)

    toast({
      title: "Link copied",
      description: "Post link has been copied to clipboard",
    })
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    if (!userName.trim() || !userEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter both name and email",
        variant: "destructive",
      })
      return
    }

    // Save user info
    localStorage.setItem("userName", userName)
    localStorage.setItem("userEmail", userEmail)

    setShowSignup(false)

    toast({
      title: "Welcome!",
      description: "You can now like, comment, and share posts",
    })
  }

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

        {showSignup ? (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Continue as User</h2>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="userName" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="userEmail" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="userEmail"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Your email"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Continue</Button>
                <Button type="button" variant="outline" onClick={() => setShowSignup(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
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

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-1 ${liked ? "text-red-500" : ""}`}
                    onClick={handleLike}
                  >
                    <Heart className={`h-5 w-5 ${liked ? "fill-red-500" : ""}`} />
                    <span>{likeCount}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-5 w-5" />
                    <span>{comments.length}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="content">
                  <div
                    className="prose prose-gray dark:prose-invert max-w-none prose-img:rounded-md prose-headings:font-bold prose-a:text-primary"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </TabsContent>
                <TabsContent value="comments">
                  <div className="space-y-4">
                    <form onSubmit={handleComment} className="flex gap-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <Button type="submit" size="icon" className="h-10 w-10">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>

                    <Separator />

                    <div className="space-y-4">
                      {comments.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.id} className="flex gap-4">
                            <Avatar>
                              <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{comment.userName}</span>
                                <span className="text-xs text-muted-foreground">{formatDate(comment.date)}</span>
                              </div>
                              <p className="mt-1">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

