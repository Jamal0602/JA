"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/hooks/use-analytics"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"
import { BarChart, Clock, Users } from "lucide-react"
import { useTheme } from "next-themes"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminAnalyticsWidget() {
  const { data, isLoading, error } = useAnalytics("7d")
  const { theme } = useTheme()
  const [showError, setShowError] = useState(false)
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000"
  const gridColor = theme === "dark" ? "#333333" : "#EEEEEE"

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Analytics Overview
          </CardTitle>
          <CardDescription>Recent website performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-[180px] w-full" />
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Analytics Overview
          </CardTitle>
          <CardDescription>Recent website performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[240px] text-center">
            {showError ? (
              <>
                <p className="text-muted-foreground mb-4">{error || "Failed to load analytics data"}</p>
                <Button size="sm" onClick={() => setShowError(false)}>Hide Error</Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">Unable to load analytics data</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowError(true)}>
                    Show Error
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/admin/analytics">View Dashboard</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const { summary, visitorTrends } = data

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Analytics Overview
        </CardTitle>
        <CardDescription>Recent website performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[180px] mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitorTrends} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorVisitorsWidget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke={textColor} fontSize={12} />
              <YAxis stroke={textColor} fontSize={12} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorVisitorsWidget)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" /> Visitors
            </span>
            <span className="font-bold">{summary.totalVisitors.toLocaleString()}</span>
            <span className={`text-xs ${summary.visitorGrowth >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {summary.visitorGrowth >= 0 ? "↑" : "↓"} {Math.abs(summary.visitorGrowth)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Page Views</span>
            <span className="font-bold">{summary.pageViews.toLocaleString()}</span>
            <span className={`text-xs ${summary.pageViewGrowth >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {summary.pageViewGrowth >= 0 ? "↑" : "↓"} {Math.abs(summary.pageViewGrowth)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Avg. Time
            </span>
            <span className="font-bold">{summary.averageSessionDuration}</span>
            <span className={`text-xs ${summary.durationGrowth >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {summary.durationGrowth >= 0 ? "↑" : "↓"} {Math.abs(summary.durationGrowth)}%
            </span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/analytics">View Full Analytics</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 