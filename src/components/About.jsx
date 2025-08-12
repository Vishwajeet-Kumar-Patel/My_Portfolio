import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../utils/motion";
import { styles } from "../style";
import { services } from "../constants";
import { Tilt } from "react-tilt";
import { SectionWrapper } from "../hoc";

const ServiceCard = ({ index, title, icon }) => {
  return (
    <Tilt className="w-full xs:w-[280px] sm:w-[320px] md:w-[250px]">
      <motion.div
        variants={fadeIn("right", "spring", 0.5 * index, 0.75)}
        className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
      >
        <div
          options={{ max: 45, scale: 1, speed: 450 }}
          className="bg-tertiary rounded-[20px] py-4 xs:py-5 px-8 xs:px-12 min-h-[240px] xs:min-h-[280px] flex justify-evenly items-center flex-col"
        >
          <img src={icon} alt={title} className="w-12 h-12 xs:w-16 xs:h-16 object-contain" />
          <h3 className="text-white text-[18px] xs:text-[20px] font-bold text-center leading-tight">
            {title}
          </h3>
        </div>
      </motion.div>
    </Tilt>
  );
};
const About = () => {
  return (
    <>
      <motion.div variants={textVariant}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-3 xs:mt-4 text-secondary text-[15px] xs:text-[16px] sm:text-[17px] max-w-full sm:max-w-3xl leading-[24px] xs:leading-[28px] sm:leading-[30px]"
      >
        Self-driven Computer Science undergraduate specializing in full-stack development, AI/ML, and game development. Proficient in the MERN stack and Spring Boot, with projects including TrackWell (fitness tracker), KrishiConnect (agri-tech platform), Resume Ranker (career and roadmap recommender), and EduIntel (AI learning platform). Skilled in Unity (C#) and passionate about emerging technologies like Generative AI, Quantum Machine Learning, Swarm Intelligence, and Edge AI.
      </motion.p>
      <div className="mt-12 xs:mt-16 sm:mt-20 flex flex-wrap justify-center gap-6 xs:gap-8 sm:gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
