import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Mock data - in a real application, this would come from a database or analytics service
  const mockData = {
    summary: {
      totalVisitors: 14892,
      pageViews: 36485,
      averageSessionDuration: "2m 43s",
      bounceRate: "42.8%",
      visitorGrowth: 12.5,
      pageViewGrowth: 8.2,
      durationGrowth: -1.4
    },
    visitorTrends: [
      { name: "Jan", visitors: 1200 },
      { name: "Feb", visitors: 1900 },
      { name: "Mar", visitors: 2400 },
      { name: "Apr", visitors: 1800 },
      { name: "May", visitors: 2800 },
      { name: "Jun", visitors: 3200 },
      { name: "Jul", visitors: 2900 }
    ],
    pageViews: [
      { name: "Home", views: 5200 },
      { name: "About", views: 2100 },
      { name: "Skills", views: 1800 },
      { name: "Projects", views: 3400 },
      { name: "Contact", views: 980 },
      { name: "Blog", views: 2700 }
    ],
    devices: [
      { name: "Desktop", value: 58 },
      { name: "Mobile", value: 36 },
      { name: "Tablet", value: 6 }
    ],
    sources: [
      { name: "Direct", value: 42 },
      { name: "Search", value: 28 },
      { name: "Social", value: 18 },
      { name: "Referral", value: 12 }
    ],
    countries: [
      { name: "United States", value: 32 },
      { name: "United Kingdom", value: 15 },
      { name: "Germany", value: 12 },
      { name: "France", value: 8 },
      { name: "Canada", value: 6 },
      { name: "Others", value: 27 }
    ]
  }

  // Get the time range from query parameters (default to 7d if not provided)
  const searchParams = request.nextUrl.searchParams
  const timeRange = searchParams.get("timeRange") || "7d"
  
  // In a real app, we would filter the data based on the timeRange
  // For this mock, we'll just return the same data regardless of timeRange
  
  return NextResponse.json({
    success: true,
    timeRange,
    data: mockData
  })
} 