"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, Instagram, Github, Menu, X, Bell, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
  type: NotificationType;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const [email, setEmail] = useState("")
  const [isSubscribeDialogOpen, setIsSubscribeDialogOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { toast } = useToast()

  // Close menu when switching to desktop view
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false)
    }
  }, [isMobile])

  // Load notifications and subscriber count
  useEffect(() => {
    // Simulate loading notifications
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "New Post Published",
        content: "Check out our latest post on IoT solutions!",
        date: new Date().toISOString(),
        isRead: false,
        type: "info",
      },
      {
        id: "2",
        title: "Website Update",
        content: "We've updated our website with new features.",
        date: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        type: "success",
      },
    ]

    setNotifications(mockNotifications)
    setUnreadNotifications(mockNotifications.filter((n) => !n.isRead).length)

    // Simulate subscriber count
    setSubscriberCount(128)

    // Load liked posts
    const storedLikedPosts = localStorage.getItem("likedPosts")
    if (storedLikedPosts) {
      setLikedPosts(JSON.parse(storedLikedPosts))
    }
  }, [])

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
    setUnreadNotifications((prev) => Math.max(0, prev - 1))
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
    setUnreadNotifications(0)
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    // Simulate subscribing
    setSubscriberCount((prev) => prev + 1)
    setIsSubscribeDialogOpen(false)
    setEmail("")

    toast({
      title: "Subscribed!",
      description: "You have successfully subscribed to our newsletter",
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="Jamal Asraf Portfolio Home">
            <div className="relative h-10 w-40">
              <Image
                src="/logo.png"
                alt="Jamal Asraf Logo"
                width={160}
                height={40}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" aria-hidden="true" />
              <span>+91 9********</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" aria-hidden="true" />
              <span>ja.jamalasraf@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          <div className="flex gap-6 font-medium">
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/skills" className="transition-colors hover:text-primary">
              Skills & Tasks
            </Link>
            <Link href="/contact" className="transition-colors hover:text-primary">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isSubscribeDialogOpen} onOpenChange={setIsSubscribeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  Subscribe
                  <Badge variant="secondary" className="ml-1">
                    {subscriberCount}
                  </Badge>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Subscribe to our newsletter</DialogTitle>
                  <DialogDescription>Get notified about new posts and updates.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubscribe} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Subscribe
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Notifications</h3>
                    {unreadNotifications > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead}>
                        Mark all as read
                      </Button>
                    )}
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b last:border-b-0 ${
                          !notification.isRead ? "bg-muted/50" : ""
                        }`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-2 h-2 mt-1.5 rounded-full ${
                              notification.type === "info"
                                ? "bg-blue-500"
                                : notification.type === "success"
                                ? "bg-green-500"
                                : notification.type === "warning"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground">{notification.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notification.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <ModeToggle />
          </div>
        </nav>

        {/* Mobile Navigation Button */}
        <div className="flex md:hidden items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </Button>
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle Menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="container py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="px-2 py-1 hover:bg-muted rounded-md">
              Home
            </Link>
            <Link href="/about" className="px-2 py-1 hover:bg-muted rounded-md">
              About
            </Link>
            <Link href="/skills" className="px-2 py-1 hover:bg-muted rounded-md">
              Skills & Tasks
            </Link>
            <Link href="/contact" className="px-2 py-1 hover:bg-muted rounded-md">
              Contact
            </Link>
            <Button variant="outline" size="sm" className="flex items-center justify-center gap-1 mt-2">
              Subscribe
              <Badge variant="secondary" className="ml-1">
                {subscriberCount}
              </Badge>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

