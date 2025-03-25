"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

/**
 * Visitor data point representing visitor count for a specific time period
 */
export interface VisitorDataPoint {
  name: string;
  visitors: number;
}

/**
 * Page view data point representing view count for a specific page
 */
export interface PageViewDataPoint {
  name: string;
  views: number;
}

/**
 * Distribution data point for device, source, or geographic breakdowns
 */
export interface DistributionDataPoint {
  name: string;
  value: number;
}

/**
 * Summary of analytics metrics
 */
export interface AnalyticsSummary {
  totalVisitors: number;
  pageViews: number;
  averageSessionDuration: string;
  bounceRate: string;
  visitorGrowth: number;
  pageViewGrowth: number;
  durationGrowth: number;
}

/**
 * Complete analytics data structure
 */
export interface AnalyticsData {
  summary: AnalyticsSummary;
  visitorTrends: VisitorDataPoint[];
  pageViews: PageViewDataPoint[];
  devices: DistributionDataPoint[];
  sources: DistributionDataPoint[];
  countries: DistributionDataPoint[];
}

/**
 * Available time range options for analytics data
 */
export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y';

/**
 * Options for the useAnalytics hook
 */
interface UseAnalyticsOptions {
  /**
   * Whether to auto-refresh the data periodically
   */
  autoRefresh?: boolean;
  /**
   * Refresh interval in milliseconds
   */
  refreshInterval?: number;
}

/**
 * Analytics API response structure
 */
interface AnalyticsApiResponse {
  success: boolean;
  timeRange: TimeRange;
  data: AnalyticsData;
  error?: string;
}

/**
 * Hook for fetching and managing analytics data
 * 
 * @param initialTimeRange - Initial time range to fetch data for
 * @param options - Configuration options
 * @returns Object containing data and functions to manage analytics
 */
export function useAnalytics(
  initialTimeRange: TimeRange = '7d', 
  options: UseAnalyticsOptions = {}
) {
  const { 
    autoRefresh = false, 
    refreshInterval = 60000 // 1 minute default
  } = options;
  
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange)
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(autoRefresh)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  /**
   * Fetches analytics data from the API
   * @param showToast - Whether to show a toast notification after fetching
   */
  const fetchAnalytics = useCallback(async (showToast = false) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Add cache-busting parameter to prevent browser caching when needed
      const cacheBuster = isAutoRefreshing ? `&_=${Date.now()}` : '';
      const response = await fetch(`/api/analytics?timeRange=${timeRange}${cacheBuster}`)
      
      if (!response.ok) {
        // Check for rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          throw new Error(`Rate limit exceeded. Please try again in ${retryAfter || 'a minute'}.`);
        }
        throw new Error(`Failed to fetch analytics data: ${response.status} ${response.statusText}`)
      }
      
      const responseData: AnalyticsApiResponse = await response.json()
      
      if (!responseData.success) {
        throw new Error(responseData.error || 'Unknown error occurred')
      }
      
      setData(responseData.data)
      
      if (showToast) {
        toast({
          title: "Data Refreshed",
          description: "Analytics data has been updated.",
        })
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics data'
      setError(errorMessage)
      
      if (showToast) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [timeRange, toast, isAutoRefreshing])

  // Initialize data loading when the hook is first used
  useEffect(() => {
    fetchAnalytics();

    // Clean up on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [fetchAnalytics]);

  // Handle auto-refresh state changes
  useEffect(() => {
    if (isAutoRefreshing) {
      refreshIntervalRef.current = setInterval(() => {
        fetchAnalytics();
      }, refreshInterval);
    } else if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAutoRefreshing, refreshInterval, fetchAnalytics]);

  // Refetch when timeRange changes
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, fetchAnalytics]);

  /**
   * Manually refreshes analytics data with user feedback
   */
  const refreshData = useCallback(() => {
    fetchAnalytics(true);
  }, [fetchAnalytics]);

  /**
   * Toggles auto-refresh functionality
   */
  const toggleAutoRefresh = useCallback(() => {
    setIsAutoRefreshing(prev => {
      const newState = !prev;
      
      if (newState) {
        toast({
          title: "Auto-refresh Enabled",
          description: `Data will refresh every ${refreshInterval / 1000} seconds.`,
        });
      } else {
        toast({
          title: "Auto-refresh Disabled",
          description: "Automatic data updates have been stopped.",
        });
      }
      
      return newState;
    });
  }, [refreshInterval, toast]);

  return {
    data,
    isLoading,
    error,
    timeRange,
    setTimeRange,
    refreshData,
    isAutoRefreshing,
    toggleAutoRefresh
  }
} 