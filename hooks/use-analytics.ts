"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface AnalyticsData {
  summary: {
    totalVisitors: number;
    pageViews: number;
    averageSessionDuration: string;
    bounceRate: string;
    visitorGrowth: number;
    pageViewGrowth: number;
    durationGrowth: number;
  };
  visitorTrends: Array<{ name: string; visitors: number }>;
  pageViews: Array<{ name: string; views: number }>;
  devices: Array<{ name: string; value: number }>;
  sources: Array<{ name: string; value: number }>;
  countries: Array<{ name: string; value: number }>;
}

export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y';

export function useAnalytics(initialTimeRange: TimeRange = '7d') {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        
        const responseData = await response.json()
        
        if (!responseData.success) {
          throw new Error(responseData.error || 'Unknown error occurred')
        }
        
        setData(responseData.data)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics data'
        setError(errorMessage)
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange, toast])

  const refreshData = () => {
    // Force a refresh of the data
    setIsLoading(true)
    setError(null)
    // Re-trigger the effect
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}&_=${Date.now()}`)
        
        if (!response.ok) {
          throw new Error('Failed to refresh analytics data')
        }
        
        const responseData = await response.json()
        
        if (!responseData.success) {
          throw new Error(responseData.error || 'Unknown error occurred')
        }
        
        setData(responseData.data)
        toast({
          title: "Refreshed",
          description: "Analytics data has been updated.",
        })
      } catch (error) {
        console.error('Error refreshing analytics data:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to refresh analytics data'
        setError(errorMessage)
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }

  return {
    data,
    isLoading,
    error,
    timeRange,
    setTimeRange,
    refreshData
  }
} 