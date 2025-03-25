import { Octokit } from "octokit"

// Types for our GitHub database
export interface GitHubDBConfig {
  owner: string
  repo: string
  branch?: string
  path?: string
  token: string
}

export interface GitHubFile {
  path: string
  content: string
  sha?: string
}

export class GitHubDB {
  private octokit: Octokit
  private config: GitHubDBConfig

  constructor(config: GitHubDBConfig) {
    this.config = {
      branch: "main",
      path: "",
      ...config,
    }
    this.octokit = new Octokit({ auth: config.token })
  }

  // Get a file from the repository
  async getFile(path: string): Promise<any> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: `${this.config.path}${path}`,
        ref: this.config.branch,
      })

      // @ts-ignore - The response type is complex
      const content = Buffer.from(response.data.content, "base64").toString()
      // @ts-ignore
      const sha = response.data.sha

      return { content: JSON.parse(content), sha }
    } catch (error: any) {
      if (error.status === 404) {
        return null
      }
      throw error
    }
  }

  // Create or update a file in the repository
  async saveFile(path: string, data: any): Promise<string> {
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64")

    try {
      // Try to get the file first to get the SHA
      const file = await this.getFile(path)

      if (file) {
        // Update existing file
        const response = await this.octokit.rest.repos.createOrUpdateFileContents({
          owner: this.config.owner,
          repo: this.config.repo,
          path: `${this.config.path}${path}`,
          message: `Update ${path}`,
          content,
          sha: file.sha,
          branch: this.config.branch,
        })

        // @ts-ignore
        return response.data.content.sha
      } else {
        // Create new file
        const response = await this.octokit.rest.repos.createOrUpdateFileContents({
          owner: this.config.owner,
          repo: this.config.repo,
          path: `${this.config.path}${path}`,
          message: `Create ${path}`,
          content,
          branch: this.config.branch,
        })

        // @ts-ignore
        return response.data.content.sha
      }
    } catch (error) {
      console.error("Error saving file to GitHub:", error)
      throw error
    }
  }

  // Delete a file from the repository
  async deleteFile(path: string): Promise<boolean> {
    try {
      const file = await this.getFile(path)

      if (!file) {
        return false
      }

      await this.octokit.rest.repos.deleteFile({
        owner: this.config.owner,
        repo: this.config.repo,
        path: `${this.config.path}${path}`,
        message: `Delete ${path}`,
        sha: file.sha,
        branch: this.config.branch,
      })

      return true
    } catch (error) {
      console.error("Error deleting file from GitHub:", error)
      throw error
    }
  }

  // List all files in a directory
  async listFiles(directory = ""): Promise<string[]> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.config.owner,
        repo: this.config.repo,
        path: `${this.config.path}${directory}`,
        ref: this.config.branch,
      })

      // @ts-ignore - The response type is complex
      return response.data
        .filter((item: any) => item.type === "file")
        .map((item: any) => item.path.replace(`${this.config.path}`, ""))
    } catch (error) {
      console.error("Error listing files from GitHub:", error)
      throw error
    }
  }
}

// Cache mechanism to reduce API calls
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function getCachedData(db: GitHubDB, path: string) {
  const now = Date.now()
  const cachedItem = cache.get(path)

  if (cachedItem && now - cachedItem.timestamp < CACHE_TTL) {
    return cachedItem.data
  }

  const data = await db.getFile(path)
  if (data) {
    cache.set(path, { data: data.content, timestamp: now })
    return data.content
  }

  return null
}

// Clear cache for a specific path
export function clearCache(path: string) {
  cache.delete(path)
}

