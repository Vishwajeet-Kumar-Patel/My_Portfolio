import {
  backend,
  blog,
  carrent,
  trackwell,
  creator,
  css,
  figma,
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
  web,
} from "../assets";
import kotlin from "../assets/tech/springboot.png";
import postman from "../assets/tech/postman.png";
import sorting from "../assets/sorting.png";
import social from "../assets/social.png";
import resume from "../assets/resume.png";
import parcare from "../assets/parcare.png";
import education from "../assets/education.png";
import work from "../assets/work.png";
import mysql from "../assets/tech/mysql.png";
import canva from "../assets/tech/canva.png";

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
    name: "SpringBoot",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
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
    name: "git",
    icon: git,
  },
  {
    name: "canva",
    icon: canva,
  },
  {
    name: "postman",
    icon: postman,
  },
  {
    name: "kotlin",
    icon: kotlin,
  },

  {
    name: "mysql",
    icon: mysql,
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
    title: "Machine Learning Intern",
    company_name: "Code alpha",
    icon: work,
    iconBg: "#E6DEDD",
    date: "March 2025 - Ongoing",
    points: [
      "Built and deployed end-to-end machine learning models using Python, Scikit-learn, and TensorFlow, improving prediction accuracy by 25% through feature engineering and hyperparameter tuning",
    "Designed automated data preprocessing pipelines, reducing manual effort by 50% and accelerating model training cycles",
    "Integrated ML models into full-stack applications via REST APIs, enabling real-time predictions and enhancing user experience",
    "Optimized model performance using evaluation metrics like precision, recall, and F1-score, ensuring robustness across multiple datasets",
    "Created dynamic visualizations and dashboards using Matplotlib and Seaborn to communicate key insights and model performance to non-technical stakeholders",
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
