import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { styles } from "../style";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (inView) setShowCanvas(true);
  }, [inView]);

  return (
    <section
      ref={ref}
      className="relative w-full h-screen mx-auto bg-gradient-to-b from-black via-[#0f0f1f] to-black overflow-hidden"
    >
      {/* Text Content */}
      <div
        className={`${styles.paddingX} absolute inset-0 top-[80px] xs:top-[100px] sm:top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-3 xs:gap-4 sm:gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-3 xs:mt-4 sm:mt-5 flex-shrink-0">
          <div className="w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-[#915eff]" />
          <div className="w-1 h-20 xs:h-32 sm:h-40 md:h-60 lg:h-80 violet-gradient" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 min-w-0"
        >
          <h1 className={`${styles.heroHeadText} max-w-4xl`}>
            Hello, I'm{" "}
            <span className="text-[#915eff] drop-shadow-lg">
              Vishwajeet Kumar
            </span>
          </h1>
          <p className={`${styles.heroSubText} mt-3 xs:mt-4 max-w-xl xs:max-w-2xl sm:max-w-3xl`}>
            I design & build modern full stack web applications and craft smart
            machine learning solutions that solve real-world problems.
          </p>
        </motion.div>
      </div>

      {/* 3D Robot Canvas */}
      {showCanvas && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full flex justify-center items-center"
        >
          <div className="w-full h-full max-w-2xl xs:max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl mt-16 xs:mt-20 sm:mt-8 md:mt-4 lg:mt-0">
            <ComputersCanvas />
          </div>
        </motion.div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-16 xs:bottom-20 sm:bottom-24 md:bottom-28 lg:bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[30px] h-[50px] xs:w-[35px] xs:h-[60px] sm:w-[35px] sm:h-[64px] rounded-3xl border-2 xs:border-3 sm:border-4 border-secondary flex justify-center items-start p-1 xs:p-1.5 sm:p-2">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
