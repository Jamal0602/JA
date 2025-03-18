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
                  Hello! I'm Jamal Asraf, An entrepreneur with a lot of big Dreams. Born in 2008 Feb 6. I've been working on various projects that combine
                  hardware and software to create innovative solutions. I did a lot of projects in <a href="periyar-atl.blogspot.com">ATAL</a>. And participated and won many competition and
                  hacktones.
                </p>
                <p>
                  My tech journey begins in 2022, me and my friend planed to make a startup in future it's <a href= "mpa.cubiz.space">MPA</a> its done in 2024. i begin with blogger and now i am 
                  just created it on React using ai on 2025 it's a big change.
                </p>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm aspect-square rounded-full overflow-hidden border-8 border-background shadow-xl">
                <Image src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPIuT7eIicQX-8hDfI6MyXNZxfXdac0VvIqYhQCLqT7IwDEkyL4-keeoxAYW3x13QlLLtJqL3Ab9KX8rhFtDhc4hbxHVS0WOLQxkA3oW1RdIj-tTS0b8x06F4H1L-qYfQPS9oM5tKPBIQ4bCF_uz4QZr5MG2F2Mr2i_txHpcCWmA6W0GY/s1600/small%20boy.jpg" alt="Jamal Asraf" fill className="object-cover" />
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
                year: "2025 - Startup Begin",
                title: "CEO OF Cubiz Group's of Technology",
                organization: "Cubiz Group's of Technology",
                description: "Managing Users, Employees, Projects, Websites, Domains.",
                icon: Startup,
              },
              {
                year: "2023 - 2025",
                title: "Project Developer & Student",
                organization: "Periyar Govt Hr Sec School",
                description: "As a Student passed secondary school & working in ATAL as IOT & Arduino Project Developer",
                icon: Developer,
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
              "IoT Development",
              "Web Development",
              "LOGO Disgner",
              "Python",
              "C++",
              "HTML/CSS",
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

