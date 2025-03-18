import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase, GraduationCap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Me</h1>
                <p className="text-muted-foreground md:text-xl">Learn more about my journey, experience, and passion</p>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Hello! I'm Jamal Asraf, a passionate technologist with over 15 years of experience in the field of
                  electronics, IoT, and web development. Since 2008, I've been working on various projects that combine
                  hardware and software to create innovative solutions.
                </p>
                <p>
                  My journey began with a fascination for electronics, which eventually led me to explore the world of
                  programming and web development. Today, I specialize in creating integrated systems that leverage the
                  power of IoT to solve real-world problems.
                </p>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm aspect-square rounded-full overflow-hidden border-8 border-background shadow-xl">
                <Image src="/placeholder.svg?height=500&width=500" alt="Jamal Asraf" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl accent-underline">My Journey</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              A timeline of my professional experience and education
            </p>
          </div>

          <div className="mt-12 space-y-8">
            {[
              {
                year: "2020 - Present",
                title: "Senior IoT Developer",
                organization: "Tech Innovations Inc.",
                description: "Leading the development of IoT solutions for industrial applications.",
                icon: Briefcase,
              },
              {
                year: "2015 - 2020",
                title: "Electronics Engineer",
                organization: "Smart Systems Ltd.",
                description: "Designed and implemented electronic systems for automation and control.",
                icon: Briefcase,
              },
              {
                year: "2012 - 2015",
                title: "Web Developer",
                organization: "Digital Solutions",
                description: "Created responsive web applications and interfaces for various clients.",
                icon: Briefcase,
              },
              {
                year: "2008 - 2012",
                title: "Bachelor's in Electronics Engineering",
                organization: "University of Technology",
                description: "Graduated with honors, specializing in embedded systems.",
                icon: GraduationCap,
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/4 flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 md:text-right">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{item.year}</p>
                    <p className="text-sm text-muted-foreground">{item.organization}</p>
                  </div>
                </div>
                <div className="md:w-3/4 pl-16 md:pl-12 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-border">
                  <div className="absolute left-0 top-0 w-3 h-3 -translate-x-1/2 rounded-full bg-primary" />
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground mt-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Expertise */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl accent-underline">
              Skills & Expertise
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Areas where I excel and bring value
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
            {[
              "Electronics Design",
              "IoT Development",
              "Web Development",
              "Embedded Systems",
              "Circuit Design",
              "PCB Layout",
              "Microcontrollers",
              "Sensors Integration",
              "JavaScript",
              "Python",
              "C/C++",
              "HTML/CSS",
              "React",
              "Node.js",
              "Arduino",
              "Raspberry Pi",
            ].map((skill, index) => (
              <div
                key={index}
                className="bg-background rounded-lg border p-4 text-center hover:border-primary transition-colors"
              >
                {skill}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button asChild>
              <Link href="/skills">View Detailed Skills</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

