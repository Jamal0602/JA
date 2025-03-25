import { githubDB, COLLECTIONS } from "./db-config"
import { getCachedData, clearCache } from "./github-db"
import type { Post } from "./types"

// Post operations
export async function getAllPosts(): Promise<Post[]> {
  try {
    const posts = await getCachedData(githubDB, COLLECTIONS.POSTS)
    return posts || []
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const posts = await getAllPosts()
    return posts.find((post) => post.id === id) || null
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error)
    return null
  }
}

export async function createPost(post: Post): Promise<boolean> {
  try {
    const posts = await getAllPosts()
    posts.push(post)
    await githubDB.saveFile(COLLECTIONS.POSTS, posts)
    clearCache(COLLECTIONS.POSTS)
    return true
  } catch (error) {
    console.error("Error creating post:", error)
    return false
  }
}

export async function updatePost(post: Post): Promise<boolean> {
  try {
    const posts = await getAllPosts()
    const index = posts.findIndex((p) => p.id === post.id)

    if (index === -1) {
      return false
    }

    posts[index] = post
    await githubDB.saveFile(COLLECTIONS.POSTS, posts)
    clearCache(COLLECTIONS.POSTS)
    return true
  } catch (error) {
    console.error(`Error updating post ${post.id}:`, error)
    return false
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const posts = await getAllPosts()
    const filteredPosts = posts.filter((post) => post.id !== id)

    if (filteredPosts.length === posts.length) {
      return false
    }

    await githubDB.saveFile(COLLECTIONS.POSTS, filteredPosts)
    clearCache(COLLECTIONS.POSTS)
    return true
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error)
    return false
  }
}

// Widget operations
export async function getAllWidgets() {
  try {
    const widgets = await getCachedData(githubDB, COLLECTIONS.WIDGETS)
    return widgets || []
  } catch (error) {
    console.error("Error fetching widgets:", error)
    return []
  }
}

// Settings operations
export async function getSettings() {
  try {
    const settings = await getCachedData(githubDB, COLLECTIONS.SETTINGS)
    return settings || {}
  } catch (error) {
    console.error("Error fetching settings:", error)
    return {}
  }
}

export async function updateSettings(settings: any): Promise<boolean> {
  try {
    await githubDB.saveFile(COLLECTIONS.SETTINGS, settings)
    clearCache(COLLECTIONS.SETTINGS)
    return true
  } catch (error) {
    console.error("Error updating settings:", error)
    return false
  }
}

// Page operations
export async function getAllPages() {
  try {
    const pages = await getCachedData(githubDB, COLLECTIONS.PAGES)
    return pages || []
  } catch (error) {
    console.error("Error fetching pages:", error)
    return []
  }
}

// Subscriber operations
export async function getAllSubscribers() {
  try {
    const subscribers = await getCachedData(githubDB, COLLECTIONS.SUBSCRIBERS)
    return subscribers || []
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    return []
  }
}

export async function addSubscriber(email: string): Promise<boolean> {
  try {
    const subscribers = await getAllSubscribers()

    if (subscribers.includes(email)) {
      return true // Already subscribed
    }

    subscribers.push(email)
    await githubDB.saveFile(COLLECTIONS.SUBSCRIBERS, subscribers)
    clearCache(COLLECTIONS.SUBSCRIBERS)
    return true
  } catch (error) {
    console.error("Error adding subscriber:", error)
    return false
  }
}

// Comments operations
export async function getCommentsByPostId(postId: string) {
  try {
    const allComments = (await getCachedData(githubDB, COLLECTIONS.COMMENTS)) || {}
    return allComments[postId] || []
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    return []
  }
}

// Likes operations
export async function getLikesByPostId(postId: string) {
  try {
    const allLikes = (await getCachedData(githubDB, COLLECTIONS.LIKES)) || {}
    return allLikes[postId] || []
  } catch (error) {
    console.error(`Error fetching likes for post ${postId}:`, error)
    return []
  }
}

// Domain operations
export async function getAllDomains() {
  try {
    const domains = await getCachedData(githubDB, COLLECTIONS.DOMAINS)
    return domains || []
  } catch (error) {
    console.error("Error fetching domains:", error)
    return []
  }
}

// Notification operations
export async function getAllNotifications() {
  try {
    const notifications = await getCachedData(githubDB, COLLECTIONS.NOTIFICATIONS)
    return notifications || []
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

