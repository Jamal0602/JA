// Offline storage utility functions
import type { Post, Comment, Like } from "./types"

// Constants
const STORAGE_KEYS = {
  POSTS: "offline-posts",
  COMMENTS: "offline-comments",
  LIKES: "offline-likes",
  SYNC_QUEUE: "offline-sync-queue",
  LAST_SYNC: "offline-last-sync",
}

// Types
type SyncQueueItem = {
  id: string
  type: "post" | "comment" | "like" | "unlike"
  data: any
  timestamp: number
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Initialize IndexedDB
export function initIndexedDB(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isBrowser || !("indexedDB" in window)) {
      console.warn("IndexedDB not supported")
      resolve(false)
      return
    }

    const request = indexedDB.open("JamalAsrafWebsite", 1)

    request.onerror = () => {
      console.error("Failed to open IndexedDB")
      resolve(false)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object stores
      if (!db.objectStoreNames.contains("posts")) {
        db.createObjectStore("posts", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("comments")) {
        db.createObjectStore("comments", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("likes")) {
        db.createObjectStore("likes", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("syncQueue")) {
        db.createObjectStore("syncQueue", { keyPath: "id" })
      }
    }

    request.onsuccess = () => {
      resolve(true)
    }
  })
}

// Save posts to IndexedDB
export async function savePosts(posts: Post[]): Promise<boolean> {
  if (!isBrowser) return false

  try {
    // First try IndexedDB
    const db = await openDB()
    if (db) {
      const tx = db.transaction("posts", "readwrite")
      const store = tx.objectStore("posts")

      // Clear existing posts
      await clearObjectStore(store)

      // Add new posts
      for (const post of posts) {
        store.add(post)
      }

      await tx.complete
      db.close()
      return true
    }

    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts))
    return true
  } catch (error) {
    console.error("Error saving posts offline:", error)
    return false
  }
}

// Get posts from IndexedDB
export async function getPosts(): Promise<Post[]> {
  if (!isBrowser) return []

  try {
    // First try IndexedDB
    const db = await openDB()
    if (db) {
      const tx = db.transaction("posts", "readonly")
      const store = tx.objectStore("posts")
      const posts = await store.getAll()
      db.close()
      return posts
    }

    // Fallback to localStorage
    const postsJson = localStorage.getItem(STORAGE_KEYS.POSTS)
    return postsJson ? JSON.parse(postsJson) : []
  } catch (error) {
    console.error("Error getting posts from offline storage:", error)
    return []
  }
}

// Save a comment
export async function saveComment(comment: Comment): Promise<boolean> {
  if (!isBrowser) return false

  try {
    // First try IndexedDB
    const db = await openDB()
    if (db) {
      const tx = db.transaction("comments", "readwrite")
      const store = tx.objectStore("comments")
      store.add(comment)
      await tx.complete

      // Add to sync queue
      await addToSyncQueue({
        id: comment.id,
        type: "comment",
        data: comment,
        timestamp: Date.now(),
      })

      db.close()
      return true
    }

    // Fallback to localStorage
    const commentsJson = localStorage.getItem(STORAGE_KEYS.COMMENTS)
    const comments = commentsJson ? JSON.parse(commentsJson) : []
    comments.push(comment)
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments))

    // Add to sync queue
    const queueJson = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE)
    const queue = queueJson ? JSON.parse(queueJson) : []
    queue.push({
      id: comment.id,
      type: "comment",
      data: comment,
      timestamp: Date.now(),
    })
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue))

    return true
  } catch (error) {
    console.error("Error saving comment offline:", error)
    return false
  }
}

// Get comments for a post
export async function getComments(postId: string): Promise<Comment[]> {
  if (!isBrowser) return []

  try {
    // First try IndexedDB
    const db = await openDB()
    if (db) {
      const tx = db.transaction("comments", "readonly")
      const store = tx.objectStore("comments")
      const allComments = await store.getAll()
      db.close()
      return allComments.filter((comment) => comment.postId === postId)
    }

    // Fallback to localStorage
    const commentsJson = localStorage.getItem(STORAGE_KEYS.COMMENTS)
    const comments = commentsJson ? JSON.parse(commentsJson) : []
    return comments.filter((comment: Comment) => comment.postId === postId)
  } catch (error) {
    console.error("Error getting comments from offline storage:", error)
    return []
  }
}

// Save a like
export async function saveLike(like: Like): Promise<boolean> {
  if (!isBrowser) return false

  try {
    // First try IndexedDB
    const db = await openDB()
    if (db) {
      const tx = db.transaction("likes", "readwrite")
      const store = tx.objectStore("likes")
      store.add(like)
      await tx.complete

      // Add to sync queue
      await addToSyncQueue({
        id: `${like.postId}-${like.userId}`,
        type: "like",
        data: like,
        timestamp: Date.now(),
      })

      db.close()
      return true
    }

    // Fallback to localStorage
    const likesJson = localStorage.getItem(STORAGE_KEYS.LIKES)
    const likes = likesJson ? JSON.parse(likesJson) : []
    likes.push(like)
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes))

    // Add to sync queue
    const queueJson = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE)
    const queue = queueJson ? JSON.parse(queueJson) : []
    queue.push({
      id: `${like.postId}-${like.userId}`,
      type: "like",
      data: like,
      timestamp: Date.now(),
    })
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue))

    return true
  } catch (error) {
    console.error("Error saving like offline:", error)
    return false
  }
}

// Remove a like
export async function removeLike(postId: string, userId: string): Promise<boolean> {
  if (!isBrowser) return false

  try {
    // First try IndexedDB
    const db = await openDB()
    if (db) {
      const tx = db.transaction("likes", "readwrite")
      const store = tx.objectStore("likes")
      const likes = await store.getAll()
      const likeToRemove = likes.find((like) => like.postId === postId && like.userId === userId)

      if (likeToRemove) {
        await store.delete(likeToRemove.id)
      }

      await tx.complete

      // Add to sync queue
      await addToSyncQueue({
        id: `${postId}-${userId}-unlike`,
        type: "unlike",
        data: { postId, userId },
        timestamp: Date.now(),
      })

      db.close()
      return true
    }

    // Fallback to localStorage
    const likesJson = localStorage.getItem(STORAGE_KEYS.LIKES)
    let likes = likesJson ? JSON.parse(likesJson) : []
    likes = likes.filter((like: Like) => !(like.postId === postId && like.userId === userId))
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likes))

    // Add to sync queue
    const queueJson = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE)
    const queue = queueJson ? JSON.parse(queueJson) : []
    queue.push({
      id: `${postId}-${userId}-unlike`,
      type: "unlike",
      data: { postId, userId },
      timestamp: Date.now(),
    })
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue))

    return true
  } catch (error) {
    console.error("Error removing like offline:", error)
    return false
  }
}

// Check if a post is liked by a user
export async function isPostLiked(postId: string, userId: string): Promise<boolean> {
  if (!isBrowser) return false

  try {
    // First try IndexedDB
    const db = await openDB()
    if (db) {
      const tx = db.transaction("likes", "readonly")
      const store = tx.objectStore("likes")
      const likes = await store.getAll()
      db.close()
      return likes.some((like) => like.postId === postId && like.userId === userId)
    }

    // Fallback to localStorage
    const likesJson = localStorage.getItem(STORAGE_KEYS.LIKES)
    const likes = likesJson ? JSON.parse(likesJson) : []
    return likes.some((like: Like) => like.postId === postId && like.userId === userId)
  } catch (error) {
    console.error("Error checking if post is liked:", error)
    return false
  }
}

// Get sync queue
export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  if (!isBrowser) return []

  try {
    // First try IndexedDB
    const db = await openDB()
    if (db) {
      const tx = db.transaction("syncQueue", "readonly")
      const store = tx.objectStore("syncQueue")
      const queue = await store.getAll()
      db.close()
      return queue
    }

    // Fallback to localStorage
    const queueJson = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE)
    return queueJson ? JSON.parse(queueJson) : []
  } catch (error) {
    console.error("Error getting sync queue:", error)
    return []
  }
}

// Clear sync queue
export async function clearSyncQueue(): Promise<boolean> {
  if (!isBrowser) return false

  try {
    // First try IndexedDB
    const db = await openDB()
    if (db) {
      const tx = db.transaction("syncQueue", "readwrite")
      const store = tx.objectStore("syncQueue")
      await clearObjectStore(store)
      await tx.complete
      db.close()
      return true
    }

    // Fallback to localStorage
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]))
    return true
  } catch (error) {
    console.error("Error clearing sync queue:", error)
    return false
  }
}

// Set last sync time
export function setLastSyncTime(timestamp: number): void {
  if (isBrowser) {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, timestamp.toString())
  }
}

// Get last sync time
export function getLastSyncTime(): number {
  if (!isBrowser) return 0

  const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_SYNC)
  return timestamp ? Number.parseInt(timestamp, 10) : 0
}

// Helper function to open IndexedDB
async function openDB(): Promise<IDBDatabase | null> {
  if (!isBrowser || !("indexedDB" in window)) {
    return null
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open("JamalAsrafWebsite", 1)

    request.onerror = () => {
      console.error("Failed to open IndexedDB")
      resolve(null)
    }

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains("posts")) {
        db.createObjectStore("posts", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("comments")) {
        db.createObjectStore("comments", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("likes")) {
        db.createObjectStore("likes", { keyPath: "id" })
      }

      if (!db.objectStoreNames.contains("syncQueue")) {
        db.createObjectStore("syncQueue", { keyPath: "id" })
      }
    }
  })
}

// Helper function to clear an object store
async function clearObjectStore(store: IDBObjectStore): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = store.clear()

    request.onerror = () => {
      reject(new Error("Failed to clear object store"))
    }

    request.onsuccess = () => {
      resolve()
    }
  })
}

// Helper function to add an item to the sync queue
async function addToSyncQueue(item: SyncQueueItem): Promise<boolean> {
  if (!isBrowser) return false

  try {
    const db = await openDB()
    if (db) {
      const tx = db.transaction("syncQueue", "readwrite")
      const store = tx.objectStore("syncQueue")
      store.add(item)
      await tx.complete
      db.close()
      return true
    }

    return false
  } catch (error) {
    console.error("Error adding to sync queue:", error)
    return false
  }
}

