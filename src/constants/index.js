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
    title: "Full Stack Intern",
    company_name: "Bharat Intern",
    icon: work,
    iconBg: "#E6DEDD",
    date: "August 2023 - September 2023",
    points: [
      "Developed and maintained responsive web applications using MERN stack, ensuring seamless user experience across devices",
      "Engineered RESTful APIs with Node.js and Express, optimizing server performance and enabling smooth data communication between frontend and backend",
      "Implemented secure user authentication and authorization using JWT and OAuth, enhancing application security and access control",
      "Improved application performance by 35% through efficient state management using React Context API and optimized component rendering",
      "Collaborated in an agile environment using Git, GitHub, and Trello, contributing to clean, modular, and maintainable codebases while meeting tight deadlines",
    ],
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
}
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
      "A comprehensive MERN stack web application focused on mental health assessment, providing users with tools to evaluate and track their mental wellness through interactive questionnaires and personalized insights.",
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
      "TrackWell is a full-stack fitness tracker web app built using the MERN stack, designed to help users monitor workouts.",
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
    name: "GameAware",
    description:
      "Web application to educate people about the difference between Gaming and Gambling.",
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
      "A comprehensive web application that allows users to share and read blogs with all the trendy features.",
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
  /*{
    name: "PARCARE",
    description:
      "Positive and engaging user experience design. The main goal of app is ease parking and save user's time by collaborating with private parking areas.",
    tags: [
      {
        name: "UI/UX",
        color: "pink-text-gradient",
      },
      {
        name: "figma",
        color: "blue-text-gradient",
      },
      {
        name: "inkscape",
        color: "green-text-gradient",
      },
      {
        name: "coolers",
        color: "pink-text-gradient",
      },
    ],
    image: parcare,
    source_code_link: "https://www.behance.net/gallery/207227903/PARCARE",
  },*/
];

export { experiences, projects, services, technologies, testimonials };
