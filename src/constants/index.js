import {
  backend,
  blog,
  carrent,
  trackwell,
  creator,
  css,
  git,
  gameaware,
  html,
  javascript,
  jobit,
  mobile,
  mongodb,
  nodejs,
  reactjs,
  redux,
  starbucks,
  tailwind,
  tesla,
  threejs,
  tripguide,
  typescript,
  web, // Still needed for services
  mindware, // New project
  // Additional tech imports
  springboot,
  postman,
  canva,
  nextjs,
  postgres,
} from "../assets";
import sorting from "../assets/sorting.png";
import social from "../assets/social.png";
import resume from "../assets/resume.png";
import parcare from "../assets/parcare.png";
import education from "../assets/education.png";
import work from "../assets/work.png";
import resumeranker from "../assets/resumeranker.png";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Spring Boot Developer",
    icon: web,
  },
  {
    title: "Game Developer",
    icon: mobile,
  },
  {
    title: "ML Engineer",
    icon: backend,
  },
  {
    title: "MERN Stack Developer",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Next JS",
    icon: nextjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "PostgreSQL",
    icon: postgres,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "Git",
    icon: git,
  },
  {
    name: "Spring Boot",
    icon: springboot,
  },
  {
    name: "Postman",
    icon: postman,
  },
  {
    name: "Canva",
    icon: canva,
  },
];

const experiences = [
  {
    title: "Bachelor of Technology",
    company_name: "University of Lucknow",
    icon: education,
    iconBg: "#E6DEDD",
    date: "August 2022 - Ongoing",
    points: ["Computer Science and Engineering with specialisation in Artificial Intelligence"],
  },
  {
  title: "Cyber Security Intern",
  company_name: "CybarGyan, C-DAC Noida",
  icon: work,
  iconBg: "#E6DEDD",
  date: "19th May 2025 - 30th June 2025",
  points: [
    "Completed a 6-week intensive internship focused on cyber security tools, practices, and network defense mechanisms under the guidance of C-DAC Noida experts.",
    "Gained hands-on experience with tools such as Wireshark, Nmap, Burp Suite, and Metasploit for vulnerability scanning and network analysis.",
    "Learned secure coding practices and performed penetration testing on web applications to identify and patch security flaws.",
    "Implemented firewall rules, intrusion detection systems, and log analysis to monitor and secure network traffic.",
    "Prepared a detailed project report and gave a final presentation highlighting security solutions and mitigation strategies implemented during the internship."
  ],
},
{
    title: "Software Developer Intern",
    company_name: "StuFit Approach Private Limited",
    icon: work,
    iconBg: "#E6DEDD",
    date: "July 2025 - Ongoing",
    points: [
      "Developed and maintained responsive web applications using Next.js frontend with server-side rendering, ensuring optimal performance and seamless user experience across devices",
      "Engineered scalable RESTful APIs with NestJS backend framework, leveraging TypeScript decorators and dependency injection for robust server architecture and efficient data communication",
      "Implemented secure user authentication and role-based authorization using JWT, OAuth, and CASL (Code Access Security Layer), enhancing application security with fine-grained access control",
      "Optimized database operations using PostgreSQL with Prisma ORM, implementing efficient queries and database schema design that improved application performance by 35%",
      "Collaborated in an agile environment using Git, GitHub, and project management tools, contributing to clean, type-safe, and maintainable codebases while meeting tight deadlines",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Mindware",
    description:
      "MERN stack web application focused on mental health assessment and wellness tracking, providing users with comprehensive tools to evaluate psychological well-being and personalized mental health insights.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "Node.js",
        color: "green-text-gradient",
      },
      {
        name: "MongoDB",
        color: "pink-text-gradient",
      },
      {
        name: "Express",
        color: "blue-text-gradient",
      },
    ],
    image: mindware,
    source_code_link: "https://github.com/Vishwajeet-Kumar-Patel/Mindware",
  },
  {
    name: "TrackWell",
    description:
      "TrackWell is a comprehensive full-stack fitness tracker web application built using the MERN stack, designed to help users monitor workouts and achieve their fitness goals effectively.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "MongoDB",
        color: "green-text-gradient",
      },
      {
        name: "Tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: trackwell,
    source_code_link: "https://github.com/Vishwajeet-Kumar-Patel/TrackWell",
  },
  {
    name: "Resume Ranker",
    description:
      "MERN stack web application designed to analyze and rank resumes, providing AI-driven career recommendations and personalized skill-based roadmaps to help users improve their job prospects.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "MongoDB",
        color: "green-text-gradient",
      },
      {
        name: "Node.js",
        color: "pink-text-gradient",
      },
      {
        name: "Express",
        color: "blue-text-gradient",
      },
    ],
    image: resumeranker,
    source_code_link: "https://github.com/Vishwajeet-Kumar-Patel/Resume_Scorer",
  },
  {
    name: "GameAware",
    description:
      "Educational web application designed to raise awareness about gaming and gambling differences, providing users with comprehensive information and resources to promote responsible gaming habits.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "RestAPI",
        color: "green-text-gradient",
      },
      {
        name: "SCSS",
        color: "pink-text-gradient",
      },
    ],
    image: gameaware,
    source_code_link:
      "https://github.com/Vishwajeet-Kumar-Patel/GameAware",
  },
  {
    name: "Vishwajeet's Blog",
    description:
      "A comprehensive full-stack blog platform built with modern web technologies, enabling users to create, share, and discover engaging content with advanced features and intuitive user experience.",
    tags: [
      {
        name: "React",
        color: "blue-text-gradient",
      },
      {
        name: "Redux",
        color: "green-text-gradient",
      },
      {
        name: "MUI",
        color: "pink-text-gradient",
      },
    ],
    image: blog,
    source_code_link:
      "https://github.com/Vishwajeet-Kumar-Patel/Blog",
  },
];

export { experiences, projects, services, technologies, testimonials };
