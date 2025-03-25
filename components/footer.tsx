"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Phone, Mail, Instagram, Github, ArrowUp, Lock, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"

export default function Footer() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [adminClicks, setAdminClicks] = useState(0)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleAdminClick = () => {
    setAdminClicks((prev) => {
      const newCount = prev + 1
      if (newCount >= 3) {
        if (isAuthenticated) {
          router.push("/admin")
        } else {
          router.push("/admin/login")
        }
        return 0
      }
      return newCount
    })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Jamal Asraf</h3>
            <p className="text-sm text-muted-foreground">Personal website and portfolio since 2008.</p>
            <div className="flex items-center gap-3 pt-2">
              <Link href="https://instagram.com/Asraf_0602" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Follow me on Instagram">
                  <Instagram className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://github.com/Jamal0602" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View my GitHub profile">
                  <Github className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://linkedin.com/in/jamalasraf" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Connect with me on LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2 text-sm" aria-label="Footer Navigation">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/skills" className="hover:text-primary transition-colors">
                Skills & Tasks
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>+91 9********</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                <a 
                  href="mailto:ja.jamalasraf@gmail.com" 
                  className="hover:text-primary transition-colors"
                >
                  ja.jamalasraf@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between mt-8 pt-8 border-t">
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground mt-4 sm:mt-0">
              © {currentYear} Jamal Asraf. All rights reserved.
            </p>
            <button
              onClick={handleAdminClick}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              aria-label="Admin access"
            >
              <Lock className="h-3 w-3 inline-block" />
            </button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </footer>
  )
}

