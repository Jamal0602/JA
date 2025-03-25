import type { Post } from "./types"

// Sample post data
export const samplePosts: Post[] = [
  {
    id: "1",
    title: "IoT Based Bag Manufacturing System",
    description: "A system that monitors and controls the bag manufacturing process using IoT technology.",
    content: `
      <p>This project implements an IoT-based monitoring and control system for bag manufacturing processes. The system uses various sensors to collect real-time data from the manufacturing line and provides a dashboard for monitoring and control.</p>
      
      <h3>Key Features:</h3>
      <ul>
        <li>Real-time monitoring of production metrics</li>
        <li>Automated quality control checks</li>
        <li>Remote control of manufacturing equipment</li>
        <li>Data analytics for process optimization</li>
      </ul>
      
      <p>The system is built using ESP32 microcontrollers, various sensors, and a web-based dashboard. The data is stored in a cloud database and can be accessed from anywhere.</p>
      
      <h3>Technical Details:</h3>
      <p>The system uses MQTT protocol for communication between devices and the cloud. The dashboard is built using React and displays real-time data using WebSockets.</p>
    `,
    image: "/placeholder.svg?height=400&width=600",
    date: "2023-12-15",
    category: "IoT",
  },
  {
    id: "2",
    title: "Smart Home Automation",
    description: "A comprehensive solution for automating home appliances and systems.",
    content: `
      <p>This smart home automation project provides a complete solution for controlling and monitoring various home appliances and systems. It includes modules for lighting control, temperature regulation, security monitoring, and energy management.</p>
      
      <h3>Components:</h3>
      <ul>
        <li>Central control hub based on Raspberry Pi</li>
        <li>Smart switches for lighting control</li>
        <li>Temperature and humidity sensors</li>
        <li>Motion detection cameras</li>
        <li>Energy monitoring modules</li>
      </ul>
      
      <p>The system can be controlled via a mobile app or voice commands using integration with popular voice assistants.</p>
      
      <h3>Implementation:</h3>
      <p>The software is built using Node.js for the backend and React Native for the mobile app. The system uses Zigbee and Wi-Fi for device communication.</p>
    `,
    image: "/placeholder.svg?height=400&width=600",
    date: "2023-10-20",
    category: "Smart Home",
  },
  {
    id: "3",
    title: "Weather Monitoring Station",
    description: "A device that collects and analyzes environmental data in real-time.",
    content: `
      <p>This weather monitoring station is designed to collect and analyze various environmental parameters in real-time. It provides accurate measurements of temperature, humidity, atmospheric pressure, wind speed, and rainfall.</p>
      
      <h3>Features:</h3>
      <ul>
        <li>High-precision sensors for accurate measurements</li>
        <li>Solar-powered operation with battery backup</li>
        <li>Wireless data transmission to cloud storage</li>
        <li>Web and mobile interfaces for data visualization</li>
        <li>Historical data analysis and trend prediction</li>
      </ul>
      
      <p>The station is built using Arduino-compatible hardware and custom PCBs. It's designed to be weather-resistant and suitable for outdoor installation.</p>
      
      <h3>Data Analysis:</h3>
      <p>The collected data is processed using Python scripts and visualized using Matplotlib and D3.js. The system can also generate alerts based on predefined conditions.</p>
    `,
    image: "/placeholder.svg?height=400&width=600",
    date: "2023-08-05",
    category: "Environmental",
  },
  {
    id: "4",
    title: "Automated Irrigation System",
    description: "A system that optimizes water usage for agricultural applications.",
    content: `
      <p>This automated irrigation system is designed to optimize water usage in agricultural applications. It uses soil moisture sensors, weather data, and crop-specific requirements to determine the optimal irrigation schedule.</p>
      
      <h3>System Components:</h3>
      <ul>
        <li>Soil moisture sensors at various depths</li>
        <li>Weather station for local climate data</li>
        <li>Automated valves and pumps for water distribution</li>
        <li>Solar-powered control unit with cellular connectivity</li>
      </ul>
      
      <p>The system can reduce water usage by up to 30% compared to traditional irrigation methods while maintaining or improving crop yields.</p>
      
      <h3>Technical Implementation:</h3>
      <p>The control logic is implemented using C++ on an ESP32 microcontroller. The system includes a web interface for monitoring and manual control when needed.</p>
    `,
    image: "/placeholder.svg?height=400&width=600",
    date: "2023-06-12",
    category: "Agriculture",
  },
]

