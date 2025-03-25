import { NextRequest, NextResponse } from "next/server"

/**
 * Analytics API - Provides mock analytics data based on time range
 * 
 * Query Parameters:
 * - timeRange: One of ["24h", "7d", "30d", "90d", "1y"] (default: "7d")
 * 
 * Returns:
 * - JSON object with success status and data
 * - Data contains summary metrics, visitor trends, page views, and more
 * 
 * Rate Limits:
 * - 50 requests per minute per IP
 * 
 * Caching:
 * - Responses are cached for 5 minutes with stale-while-revalidate of 60 seconds
 */

// Simple in-memory rate limiter
// In production, this should be replaced with a Redis-based solution
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 50; // Maximum 50 requests per minute

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetAt <= now) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

/**
 * Checks if the request is within rate limits
 * @param ip - IP address of the client
 * @returns Object containing whether the request is allowed and remaining request count
 */
function checkRateLimit(ip: string): { allowed: boolean; remainingRequests: number } {
  const now = Date.now();
  
  // Get or create rate limit entry
  let entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt <= now) {
    // Create new entry if none exists or the window has expired
    entry = {
      count: 0,
      resetAt: now + RATE_LIMIT_WINDOW
    };
    rateLimitMap.set(ip, entry);
  }
  
  // Check if limit is exceeded
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remainingRequests: 0 };
  }
  
  // Increment the counter
  entry.count++;
  
  return { 
    allowed: true, 
    remainingRequests: MAX_REQUESTS_PER_WINDOW - entry.count 
  };
}

// Define types for analytics data
export interface VisitorDataPoint {
  name: string;
  visitors: number;
}

export interface PageViewDataPoint {
  name: string;
  views: number;
}

export interface DistributionDataPoint {
  name: string;
  value: number;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  pageViews: number;
  averageSessionDuration: string;
  bounceRate: string;
  visitorGrowth: number;
  pageViewGrowth: number;
  durationGrowth: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  visitorTrends: VisitorDataPoint[];
  pageViews: PageViewDataPoint[];
  devices: DistributionDataPoint[];
  sources: DistributionDataPoint[];
  countries: DistributionDataPoint[];
}

/**
 * Generates realistic time-based visitor data points
 * @param timeRange - The time range for data generation
 * @returns Array of visitor data points
 */
function generateDataPoints(timeRange: string): VisitorDataPoint[] {
  const dataPoints: VisitorDataPoint[] = []
  const now = new Date()
  
  // Generate appropriate number of data points based on time range
  switch(timeRange) {
    case "24h":
      // Generate hourly data for last 24 hours
      for (let i = 0; i < 24; i++) {
        const hour = new Date(now)
        hour.setHours(now.getHours() - (24 - i - 1))
        const hourStr = hour.getHours().toString().padStart(2, "0") + ":00"
        
        // More visitors during work hours (9am-5pm)
        const hourFactor = (hour.getHours() >= 9 && hour.getHours() <= 17) ? 1.5 : 0.7
        // Random variance
        const randomFactor = 0.8 + Math.random() * 0.4
        
        dataPoints.push({
          name: hourStr,
          visitors: Math.round(250 * hourFactor * randomFactor)
        })
      }
      break
      
    case "7d":
      // Generate daily data for last 7 days
      for (let i = 0; i < 7; i++) {
        const day = new Date(now)
        day.setDate(now.getDate() - (7 - i - 1))
        const dayStr = day.toLocaleDateString('en-US', { weekday: 'short' })
        
        // Weekends have different traffic patterns
        const isWeekend = day.getDay() === 0 || day.getDay() === 6
        const dayFactor = isWeekend ? 0.7 : 1.2
        const randomFactor = 0.85 + Math.random() * 0.3
        
        dataPoints.push({
          name: dayStr,
          visitors: Math.round(1800 * dayFactor * randomFactor)
        })
      }
      break
      
    case "30d":
      // Generate data for last 30 days (showing every 3 days for clarity)
      for (let i = 0; i < 10; i++) {
        const day = new Date(now)
        day.setDate(now.getDate() - (30 - i * 3))
        const dayStr = day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        
        const randomFactor = 0.85 + Math.random() * 0.3
        
        dataPoints.push({
          name: dayStr,
          visitors: Math.round(8000 * randomFactor)
        })
      }
      break
      
    case "90d":
      // Generate weekly data points for last 90 days
      for (let i = 0; i < 12; i++) {
        const day = new Date(now)
        day.setDate(now.getDate() - (90 - i * 7))
        const weekStr = `W${Math.ceil((day.getDate() + day.getDay()) / 7)}`
        const monthDay = day.toLocaleDateString('en-US', { month: 'short' })
        
        dataPoints.push({
          name: `${monthDay} ${weekStr}`,
          visitors: Math.round(20000 * (0.85 + Math.random() * 0.3))
        })
      }
      break
      
    case "1y":
      // Generate monthly data for last year
      for (let i = 0; i < 12; i++) {
        const month = new Date(now)
        month.setMonth(now.getMonth() - (12 - i - 1))
        const monthStr = month.toLocaleDateString('en-US', { month: 'short' })
        
        // Seasonal trends - higher traffic in certain months
        const seasonFactor = [0.8, 0.9, 1.0, 1.1, 1.1, 1.2, 1.3, 1.2, 1.0, 0.9, 1.1, 1.4][month.getMonth()]
        const randomFactor = 0.9 + Math.random() * 0.2
        
        dataPoints.push({
          name: monthStr,
          visitors: Math.round(75000 * seasonFactor * randomFactor)
        })
      }
      break
  }
  
  return dataPoints
}

/**
 * Generates page view data based on visitor data
 * @param visitorData - Array of visitor data points
 * @returns Array of page view data points
 */
function generatePageViews(visitorData: VisitorDataPoint[]): PageViewDataPoint[] {
  const commonPages = [
    { name: "Home", factor: 0.85 },
    { name: "About", factor: 0.5 },
    { name: "Skills", factor: 0.4 },
    { name: "Projects", factor: 0.65 },
    { name: "Contact", factor: 0.25 },
    { name: "Blog", factor: 0.55 }
  ]
  
  // Calculate total visitors
  const totalVisitors = visitorData.reduce((sum, item) => sum + item.visitors, 0)
  
  // Generate page views based on visitor count and page popularity
  return commonPages.map(page => ({
    name: page.name,
    views: Math.round(totalVisitors * page.factor * (0.9 + Math.random() * 0.2))
  }))
}

/**
 * Generates analytics data based on the requested time range
 * @param timeRange - Time range to generate data for
 * @returns Complete analytics data set
 */
function generateAnalyticsData(timeRange: string): AnalyticsData {
  // Generate visitor trends data based on time range
  const visitorTrends = generateDataPoints(timeRange)
  
  // Calculate total visitors
  const totalVisitors = visitorTrends.reduce((sum, item) => sum + item.visitors, 0)
  
  // Generate page views based on visitor data
  const pageViewsData = generatePageViews(visitorTrends)
  
  // Calculate total page views
  const totalPageViews = pageViewsData.reduce((sum, item) => sum + item.views, 0)
  
  // Generate growth rates based on time range
  const visitorGrowth = Number((Math.random() * 20 - 5).toFixed(1))
  const pageViewGrowth = Number((Math.random() * 18 - 4).toFixed(1))
  const durationGrowth = Number((Math.random() * 10 - 5).toFixed(1))
  
  return {
    summary: {
      totalVisitors,
      pageViews: totalPageViews,
      averageSessionDuration: `${Math.floor(Math.random() * 4) + 1}m ${Math.floor(Math.random() * 50) + 10}s`,
      bounceRate: `${Math.floor(Math.random() * 15) + 35}.${Math.floor(Math.random() * 10)}%`,
      visitorGrowth,
      pageViewGrowth,
      durationGrowth
    },
    visitorTrends,
    pageViews: pageViewsData,
    devices: [
      { name: "Desktop", value: Math.floor(Math.random() * 10) + 50 },
      { name: "Mobile", value: Math.floor(Math.random() * 10) + 30 },
      { name: "Tablet", value: Math.floor(Math.random() * 10) + 5 }
    ],
    sources: [
      { name: "Direct", value: Math.floor(Math.random() * 10) + 35 },
      { name: "Search", value: Math.floor(Math.random() * 10) + 25 },
      { name: "Social", value: Math.floor(Math.random() * 10) + 15 },
      { name: "Referral", value: Math.floor(Math.random() * 10) + 10 }
    ],
    countries: [
      { name: "United States", value: Math.floor(Math.random() * 10) + 25 },
      { name: "United Kingdom", value: Math.floor(Math.random() * 10) + 10 },
      { name: "Germany", value: Math.floor(Math.random() * 5) + 10 },
      { name: "France", value: Math.floor(Math.random() * 5) + 5 },
      { name: "Canada", value: Math.floor(Math.random() * 5) + 5 },
      { name: "Others", value: Math.floor(Math.random() * 10) + 20 }
    ]
  }
}

/**
 * GET handler for analytics data
 */
export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please try again later.",
        },
        { 
          status: 429,
          headers: {
            "Retry-After": `${Math.ceil(RATE_LIMIT_WINDOW / 1000)}`,
            "X-RateLimit-Limit": `${MAX_REQUESTS_PER_WINDOW}`,
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": `${Math.ceil(RATE_LIMIT_WINDOW / 1000)}`
          }
        }
      )
    }
    
    // Get the time range from query parameters (default to 7d if not provided)
    const searchParams = request.nextUrl.searchParams
    const timeRange = searchParams.get("timeRange") || "7d"
    
    // Validate time range parameter
    const validTimeRanges = ["24h", "7d", "30d", "90d", "1y"]
    if (!validTimeRanges.includes(timeRange)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid timeRange parameter. Must be one of: ${validTimeRanges.join(", ")}`,
        },
        { status: 400 }
      )
    }
    
    // Generate analytics data
    const mockData = generateAnalyticsData(timeRange)
    
    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 150))
    
    // Create response with cache control headers
    const response = NextResponse.json({
      success: true,
      timeRange,
      data: mockData
    })
    
    // Set cache control headers - cache for 5 minutes, revalidate if stale
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60')
    
    // Add rate limit headers to the response
    response.headers.set('X-RateLimit-Limit', `${MAX_REQUESTS_PER_WINDOW}`)
    response.headers.set('X-RateLimit-Remaining', `${rateLimitResult.remainingRequests}`)
    
    return response
  } catch (error) {
    console.error("Analytics API error:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    )
  }
} 