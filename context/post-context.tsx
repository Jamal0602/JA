"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Post } from "@/lib/types"
import { samplePosts } from "@/lib/posts"

interface PostContextType {
  posts: Post[]
  addPost: (post: Post) => void
  updatePost: (post: Post) => void
  deletePost: (id: string) => void
  getPost: (id: string) => Post | undefined
}

const PostContext = createContext<PostContextType | undefined>(undefined)

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    // Load posts from localStorage or use sample posts
    const storedPosts = localStorage.getItem("blog-posts")
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    } else {
      setPosts(samplePosts)
    }
  }, [])

  // Save posts to localStorage whenever they change
  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("blog-posts", JSON.stringify(posts))
    }
  }, [posts])

  const addPost = (post: Post) => {
    setPosts((prevPosts) => [...prevPosts, post])
  }

  const updatePost = (updatedPost: Post) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
  }

  const deletePost = (id: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
  }

  const getPost = (id: string) => {
    return posts.find((post) => post.id === id)
  }

  return (
    <PostContext.Provider value={{ posts, addPost, updatePost, deletePost, getPost }}>{children}</PostContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider")
  }
  return context
}

