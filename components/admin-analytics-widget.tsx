"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/hooks/use-analytics"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"
import { BarChart, Clock, Users, EyeIcon, RotateCw, ExternalLink } from "lucide-react"
import { useTheme } from "next-themes"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function AdminAnalyticsWidget() {
  const { data, isLoading, error, refreshData } = useAnalytics("7d")
  const { theme } = useTheme()
  const [showError, setShowError] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000"
  const gridColor = theme === "dark" ? "#333333" : "#EEEEEE"

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setTimeout(() => setIsRefreshing(false), 600) // Visual feedback for refresh action
  }

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
                  <Button size="sm" onClick={handleRefresh}>
                    <RotateCw className="mr-2 h-4 w-4" />
                    Retry
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
    <Card className="overflow-hidden border-t-4 border-t-primary">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Analytics Overview
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${isRefreshing ? 'cursor-not-allowed' : ''}`}
            disabled={isRefreshing}
            onClick={handleRefresh}
            title="Refresh data"
          >
            <RotateCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription className="flex justify-between items-center">
          <span>Recent website performance</span>
          <Badge variant="outline" className="font-normal">
            Last 7 days
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 pb-0">
        <div className="h-[180px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitorTrends} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorVisitorsWidget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke={textColor} 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={textColor} 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
              />
              <Tooltip 
                contentStyle={{ 
                  background: theme === "dark" ? "#1f2937" : "#ffffff",
                  border: `1px solid ${gridColor}`,
                  borderRadius: "6px", 
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="var(--primary)"
                fillOpacity={1}
                fill="url(#colorVisitorsWidget)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 pb-4 border-t">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" /> Visitors
            </span>
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-bold"
            >
              {summary.totalVisitors.toLocaleString()}
            </motion.span>
            <span className={`text-xs ${summary.visitorGrowth >= 0 ? "text-emerald-500" : "text-rose-500"} flex items-center`}>
              {summary.visitorGrowth >= 0 ? "↑" : "↓"} {Math.abs(summary.visitorGrowth)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <EyeIcon className="h-3 w-3" /> Views
            </span>
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-bold"
            >
              {summary.pageViews.toLocaleString()}
            </motion.span>
            <span className={`text-xs ${summary.pageViewGrowth >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {summary.pageViewGrowth >= 0 ? "↑" : "↓"} {Math.abs(summary.pageViewGrowth)}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> Avg. Time
            </span>
            <motion.span 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-bold"
            >
              {summary.averageSessionDuration}
            </motion.span>
            <span className={`text-xs ${summary.durationGrowth >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {summary.durationGrowth >= 0 ? "↑" : "↓"} {Math.abs(summary.durationGrowth)}%
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/admin/analytics" className="flex items-center justify-center">
            <span>View Full Analytics</span>
            <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 