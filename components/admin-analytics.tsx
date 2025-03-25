"use client"

import { useTheme } from "next-themes"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { Loader2, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAnalytics, TimeRange } from "@/hooks/use-analytics"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

export default function AdminAnalytics() {
  const { data, isLoading, error, timeRange, setTimeRange, refreshData } = useAnalytics()
  const { theme } = useTheme()
  const { toast } = useToast()
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000"
  const gridColor = theme === "dark" ? "#333333" : "#EEEEEE"

  const handleExportData = () => {
    // In a real app, this would generate and download a CSV or PDF report
    toast({
      title: "Export Started",
      description: "Your analytics data is being prepared for download.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If data failed to load
  if (error || !data) {
    return (
      <div className="text-center p-12 border rounded-lg">
        <h3 className="text-xl mb-4">Failed to load analytics data</h3>
        <p className="mb-6">{error || "There was an error loading the analytics data. Please try again later."}</p>
        <Button onClick={refreshData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>
    )
  }

  const { summary, visitorTrends, pageViews, devices } = data

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Monitor website traffic and user engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refreshData} title="Refresh data">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={summary.visitorGrowth >= 0 ? "text-emerald-500" : "text-rose-500"}>
                {summary.visitorGrowth >= 0 ? "↑" : "↓"} {Math.abs(summary.visitorGrowth)}%
              </span> from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.pageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className={summary.pageViewGrowth >= 0 ? "text-emerald-500" : "text-rose-500"}>
                {summary.pageViewGrowth >= 0 ? "↑" : "↓"} {Math.abs(summary.pageViewGrowth)}%
              </span> from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary.averageSessionDuration}</div>
            <p className="text-xs text-muted-foreground">
              <span className={summary.durationGrowth >= 0 ? "text-emerald-500" : "text-rose-500"}>
                {summary.durationGrowth >= 0 ? "↑" : "↓"} {Math.abs(summary.durationGrowth)}%
              </span> from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="pageviews">Page Views</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>
        <TabsContent value="visitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Trends</CardTitle>
              <CardDescription>
                Visitor count over the selected time period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorVisitors)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pageviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page View Distribution</CardTitle>
              <CardDescription>
                Most viewed pages on your website
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pageViews} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke={textColor} />
                  <YAxis stroke={textColor} />
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
              <CardDescription>
                Distribution of visitors by device type
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={400} height={300}>
                  <Pie
                    dataKey="value"
                    isAnimationActive={true}
                    data={devices}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 