import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../style";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-4 xs:p-5 rounded-2xl w-full xs:w-full sm:w-[340px] md:w-[360px]"
      >
        <div className="relative w-full h-[200px] xs:h-[220px] sm:h-[230px]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 flex justify-end m-2 xs:m-3 card-img_hover">
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className="black-gradient w-8 h-8 xs:w-10 xs:h-10 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform duration-300"
            >
              <img
                src={github}
                alt="github"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 xs:mt-5">
          <h3 className="text-white font-bold text-[20px] xs:text-[22px] sm:text-[24px] leading-tight">{name}</h3>
          <p className="mt-2 text-secondary text-[13px] xs:text-[14px] leading-relaxed">{description}</p>
        </div>
        <div className="mt-3 xs:mt-4 flex flex-wrap gap-1.5 xs:gap-2">
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[12px] xs:text-[13px] sm:text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>My work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </motion.div>
      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[15px] xs:text-[16px] sm:text-[17px] max-w-full sm:max-w-3xl leading-[24px] xs:leading-[28px] sm:leading-[30px]"
        >
          Following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>
      <div className="mt-12 xs:mt-16 sm:mt-20 flex flex-wrap justify-center gap-4 xs:gap-6 sm:gap-7">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
