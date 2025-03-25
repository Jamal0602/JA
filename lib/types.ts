export interface Post {
  id: string
  title: string
  description: string
  content: string
  image: string
  date: string
  category: string
  likes?: number
  comments?: number
  shares?: number
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  userEmail: string
  content: string
  date: string
}

export interface Like {
  postId: string
  userId: string
  date: string
}

export interface Widget {
  id: string
  name: string
  type: string
  content: any
  position: string
  order: number
  isActive: boolean
}

export interface Page {
  id: string
  title: string
  slug: string
  content: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  meta: {
    description?: string
    keywords?: string
    ogImage?: string
  }
}

export interface Settings {
  siteTitle: string
  siteDescription: string
  favicon: string
  logo: string
  googleAnalyticsId?: string
  googleAdsenseId?: string
  googleTagManagerId?: string
  recoveryEmails: string[]
  adminPassword?: string
  adminPin?: string
}

export interface Domain {
  id: string
  name: string
  url: string
  icon: string
  description: string
  isActive: boolean
}

export interface Notification {
  id: string
  title: string
  content: string
  date: string
  isRead: boolean
  type: "info" | "warning" | "success" | "error"
  link?: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  isAdmin: boolean
  likedPosts: string[]
}

