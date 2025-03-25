import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProjectCarousel from "@/components/project-carousel"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-40 hero-gradient overflow-hidden">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex flex-col space-y-4 md:space-y-6 md:w-1/2">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                <span className="text-primary">JAMAL</span> <span className="text-foreground">ASRAF</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-2">SINCE - 2008</p>
            </div>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Welcome to my personal portfolio showcasing my skills, projects, and professional journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/about">About Me</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/contact">Get In Touch</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm aspect-[3/4]">
              <Image
                src="/profile-image.jpg"
                alt="Jamal Asraf - Professional Portrait"
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recently Uploaded Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl accent-underline">
              Recently Uploaded
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Check out my latest projects and work
            </p>
          </div>

          <div className="mx-auto max-w-5xl mt-12">
            <ProjectCarousel />
          </div>
        </div>
      </section>

      {/* Skills Overview */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl accent-underline">
              Skills Overview
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A glimpse of my technical expertise and capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-12">
            {[
              { title: "Web Development", description: "Creating responsive and interactive web applications" },
              { title: "Electronics", description: "Designing and building electronic systems and circuits" },
              { title: "IoT Solutions", description: "Connecting devices and implementing smart solutions" },
              { title: "Programming", description: "Proficient in multiple programming languages" },
              { title: "UI/UX Design", description: "Crafting intuitive and engaging user experiences" },
              { title: "Project Management", description: "Leading projects from conception to completion" },
            ].map((skill, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-bold">{skill.title}</h3>
                  <p className="text-muted-foreground mt-2 flex-grow">{skill.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/skills">
                View All Skills
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

