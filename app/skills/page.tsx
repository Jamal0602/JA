import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Cpu, Database, Globe, Lightbulb, Layers, Monitor, Server, Smartphone, Wrench } from "lucide-react"

export default function SkillsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Skills & Tasks</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore my technical expertise and project capabilities
            </p>
          </div>
        </div>
      </section>

      {/* Skills Tabs Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="electronics" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="electronics" className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                <span className="hidden md:inline">Electronics</span>
              </TabsTrigger>
              <TabsTrigger value="web" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden md:inline">Web Development</span>
              </TabsTrigger>
              <TabsTrigger value="iot" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="hidden md:inline">IoT</span>
              </TabsTrigger>
              <TabsTrigger value="programming" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden md:inline">Programming</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span className="hidden md:inline">Projects</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="electronics" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Circuit Design",
                    description: "Designing analog and digital circuits for various applications",
                    icon: Cpu,
                  },
                  {
                    title: "PCB Layout",
                    description: "Creating professional PCB layouts with industry-standard tools",
                    icon: Layers,
                  },
                  {
                    title: "Microcontrollers",
                    description: "Programming and interfacing with various microcontroller platforms",
                    icon: Cpu,
                  },
                  {
                    title: "Sensors Integration",
                    description: "Implementing and calibrating different types of sensors",
                    icon: Monitor,
                  },
                  {
                    title: "Power Electronics",
                    description: "Designing power supply circuits and energy management systems",
                    icon: Lightbulb,
                  },
                  {
                    title: "Troubleshooting",
                    description: "Diagnosing and fixing issues in electronic systems",
                    icon: Wrench,
                  },
                ].map((skill, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                        <skill.icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{skill.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{skill.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="web" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Frontend Development",
                    description: "Creating responsive and interactive user interfaces",
                    icon: Monitor,
                  },
                  {
                    title: "Backend Development",
                    description: "Building robust server-side applications and APIs",
                    icon: Server,
                  },
                  {
                    title: "Database Design",
                    description: "Designing and optimizing database structures",
                    icon: Database,
                  },
                  {
                    title: "UI/UX Design",
                    description: "Crafting intuitive and engaging user experiences",
                    icon: Smartphone,
                  },
                  {
                    title: "Web Performance",
                    description: "Optimizing websites for speed and efficiency",
                    icon: Globe,
                  },
                  {
                    title: "Responsive Design",
                    description: "Ensuring websites work well on all devices",
                    icon: Layers,
                  },
                ].map((skill, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                        <skill.icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{skill.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{skill.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="iot" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "IoT Architecture",
                    description: "Designing comprehensive IoT system architectures",
                    icon: Layers,
                  },
                  {
                    title: "Sensor Networks",
                    description: "Implementing wireless sensor networks for data collection",
                    icon: Globe,
                  },
                  {
                    title: "Data Processing",
                    description: "Processing and analyzing IoT data for insights",
                    icon: Database,
                  },
                  {
                    title: "Cloud Integration",
                    description: "Connecting IoT devices to cloud platforms",
                    icon: Server,
                  },
                  {
                    title: "Edge Computing",
                    description: "Implementing edge computing solutions for IoT",
                    icon: Cpu,
                  },
                  {
                    title: "IoT Security",
                    description: "Securing IoT devices and communications",
                    icon: Wrench,
                  },
                ].map((skill, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                        <skill.icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{skill.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{skill.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="programming" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "JavaScript/TypeScript",
                    description: "Building web applications and interfaces",
                    icon: Code,
                  },
                  {
                    title: "Python",
                    description: "Data processing, automation, and IoT applications",
                    icon: Code,
                  },
                  {
                    title: "C/C++",
                    description: "Embedded systems and microcontroller programming",
                    icon: Cpu,
                  },
                  {
                    title: "HTML/CSS",
                    description: "Creating structured and styled web content",
                    icon: Monitor,
                  },
                  {
                    title: "SQL",
                    description: "Database querying and management",
                    icon: Database,
                  },
                  {
                    title: "Bash/Shell",
                    description: "Automation and system administration",
                    icon: Server,
                  },
                ].map((skill, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                        <skill.icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{skill.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{skill.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-8">
              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    title: "IoT Based Bag Manufacturing System",
                    description:
                      "A system that monitors and controls the bag manufacturing process using IoT technology.",
                    image: "/placeholder.svg?height=300&width=500",
                  },
                  {
                    title: "Smart Home Automation",
                    description: "A comprehensive solution for automating home appliances and systems.",
                    image: "/placeholder.svg?height=300&width=500",
                  },
                  {
                    title: "Weather Monitoring Station",
                    description: "A device that collects and analyzes environmental data in real-time.",
                    image: "/placeholder.svg?height=300&width=500",
                  },
                  {
                    title: "Automated Irrigation System",
                    description: "A system that optimizes water usage for agricultural applications.",
                    image: "/placeholder.svg?height=300&width=500",
                  },
                ].map((project, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      <p className="text-muted-foreground">{project.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl accent-underline">
              Services Offered
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Professional services I provide to clients and businesses
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {[
              {
                title: "Custom Electronics Design",
                description: "Tailored electronic solutions for specific requirements and applications.",
                icon: Cpu,
              },
              {
                title: "IoT System Development",
                description: "End-to-end IoT solutions from concept to implementation.",
                icon: Smartphone,
              },
              {
                title: "Web Application Development",
                description: "Custom web applications with modern technologies and frameworks.",
                icon: Globe,
              },
              {
                title: "Technical Consultation",
                description: "Expert advice on technology selection and implementation strategies.",
                icon: Lightbulb,
              },
              {
                title: "Prototype Development",
                description: "Rapid prototyping of hardware and software solutions.",
                icon: Wrench,
              },
              {
                title: "System Integration",
                description: "Seamless integration of different technologies and platforms.",
                icon: Layers,
              },
            ].map((service, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button asChild>
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

