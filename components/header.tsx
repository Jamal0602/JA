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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
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
    const mockNotifications = [
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
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-40">
              <Image
                src="/placeholder.svg?height=40&width=160"
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
              <Phone className="h-3 w-3" />
              <span>+91 9********</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>ja.jamalasraf@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
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
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-medium">Notifications</h3>
                  {unreadNotifications > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead} className="text-xs">
                      Mark all as read
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b last:border-0 ${!notification.isRead ? "bg-muted/50" : ""}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{notification.title}</h4>
                          {!notification.isRead && (
                            <Badge variant="secondary" className="ml-2">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Liked Posts">
                  <Heart className="h-5 w-5" />
                  {likedPosts.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                    >
                      {likedPosts.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Liked Posts</h3>
                </div>
                <div className="max-h-80 overflow-auto">
                  {likedPosts.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No liked posts</div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      You have liked {likedPosts.length} posts
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Link href="https://instagram.com/Asraf_0602" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="https://github.com/Jamal0602" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </Button>
            </Link>
            <ModeToggle />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background border-t p-6 md:hidden">
          <nav className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 text-lg font-medium">
              <Link href="/" className="transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" className="transition-colors hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link
                href="/skills"
                className="transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Skills & Tasks
              </Link>
              <Link
                href="/contact"
                className="transition-colors hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 9********</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>ja.jamalasraf@gmail.com</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsSubscribeDialogOpen(true)
                }}
              >
                Subscribe
                <Badge variant="secondary" className="ml-1">
                  {subscriberCount}
                </Badge>
              </Button>
              <Link href="https://instagram.com/Asraf_0602" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://github.com/Jamal0602" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

