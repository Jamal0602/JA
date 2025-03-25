import { GitHubDB } from "./github-db"

// This should be set as an environment variable in production
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ""

export const githubDB = new GitHubDB({
  owner: "Jamal0602", // Replace with your GitHub username
  repo: "website-database", // Replace with your database repository name
  branch: "main",
  path: "data/",
  token: GITHUB_TOKEN,
})

// Database collections
export const COLLECTIONS = {
  POSTS: "posts.json",
  WIDGETS: "widgets.json",
  SETTINGS: "settings.json",
  PAGES: "pages.json",
  USERS: "users.json",
  SUBSCRIBERS: "subscribers.json",
  COMMENTS: "comments.json",
  LIKES: "likes.json",
  DOMAINS: "domains.json",
  NOTIFICATIONS: "notifications.json",
}

