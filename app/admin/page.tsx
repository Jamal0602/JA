"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdmin } from "@/context/admin-context"
import AdminPostList from "@/components/admin-post-list"
import AdminWidgetList from "@/components/admin-widget-list"
import AdminPageList from "@/components/admin-page-list"
import AdminSettings from "@/components/admin-settings"
import AdminDomains from "@/components/admin-domains"
import AdminNotifications from "@/components/admin-notifications"
import { PlusCircle, LogOut, Settings, FileText, Layout, Globe, Bell } from "lucide-react"

export default function AdminPage() {
  const { logout } = useAdmin()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("posts")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (!isClient) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your website content and settings</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="widgets" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span className="hidden md:inline">Widgets</span>
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Pages</span>
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden md:inline">Domains</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Posts</h2>
            <Button asChild>
              <Link href="/admin/posts/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
          <AdminPostList />
        </TabsContent>

        <TabsContent value="widgets" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Widgets</h2>
            <Button asChild>
              <Link href="/admin/widgets/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Widget
              </Link>
            </Button>
          </div>
          <AdminWidgetList />
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Pages</h2>
            <Button asChild>
              <Link href="/admin/pages/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Page
              </Link>
            </Button>
          </div>
          <AdminPageList />
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Domains</h2>
            <Button asChild>
              <Link href="/admin/domains/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Domain
              </Link>
            </Button>
          </div>
          <AdminDomains />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <Button asChild>
              <Link href="/admin/notifications/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Notification
              </Link>
            </Button>
          </div>
          <AdminNotifications />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-2xl font-bold">Settings</h2>
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

