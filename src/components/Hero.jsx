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
      className="relative w-full h-screen mx-auto bg-gradient-to-br from-black via-[#0f0f1f] to-[#1a0b2e] overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#915eff]/5 via-transparent to-[#7c3aed]/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#915eff]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      {/* Text Content */}
      <div
        className={`${styles.paddingX} absolute inset-0 top-[80px] xs:top-[100px] sm:top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-3 xs:gap-4 sm:gap-5 z-20 pointer-events-none`}
      >
        <div className="flex flex-col justify-center items-center mt-3 xs:mt-4 sm:mt-5 flex-shrink-0">
          <div className="w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-[#915eff] shadow-lg shadow-[#915eff]/50" />
          <div className="w-1 h-20 xs:h-32 sm:h-40 md:h-60 lg:h-80 violet-gradient shadow-sm" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex-1 min-w-0 pr-4 xs:pr-8 sm:pr-12 md:pr-16 lg:pr-20"
        >
          <h1 className={`${styles.heroHeadText} leading-tight`}>
            Hello, I'm{" "}
            <span className="text-[#915eff] drop-shadow-2xl bg-gradient-to-r from-[#915eff] to-[#7c3aed] bg-clip-text text-transparent">
              Vishwajeet Kumar
            </span>
          </h1>
          <p className={`${styles.heroSubText} mt-4 xs:mt-5 sm:mt-6 leading-relaxed text-gray-300 max-w-lg xs:max-w-xl`}>
            I design & build modern full stack web applications and craft smart machine learning solutions that 
            solve real-world problems.
          </p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-wrap gap-4 mt-6 xs:mt-8 pointer-events-auto"
          >
            <a
              href="#contact"
              className="px-6 py-3 bg-gradient-to-r from-[#915eff] to-[#7c3aed] rounded-lg text-white font-semibold hover:from-[#7c3aed] hover:to-[#915eff] transition-all duration-300 shadow-lg hover:shadow-[#915eff]/25 hover:scale-105"
            >
              Get In Touch
            </a>
            <a
              href="#work"
              className="px-6 py-3 bg-transparent border-2 border-[#915eff] rounded-lg text-[#915eff] font-semibold hover:bg-[#915eff] hover:text-white transition-all duration-300 shadow-lg hover:shadow-[#915eff]/25"
            >
              View Work
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* 3D Robot Canvas */}
      {showCanvas && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full flex justify-center items-center z-10 pointer-events-auto"
        >
          <div className="w-full h-full max-w-2xl xs:max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl mt-16 xs:mt-20 sm:mt-8 md:mt-4 lg:mt-0">
            <ComputersCanvas />
          </div>
        </motion.div>
      )}

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-16 xs:bottom-20 sm:bottom-24 md:bottom-28 lg:bottom-32 w-full flex justify-center items-center z-30"
      >
        <a href="#about" className="group">
          <div className="w-[30px] h-[50px] xs:w-[35px] xs:h-[60px] sm:w-[35px] sm:h-[64px] rounded-3xl border-2 xs:border-3 sm:border-4 border-secondary group-hover:border-[#915eff] flex justify-center items-start p-1 xs:p-1.5 sm:p-2 transition-colors duration-300 bg-black/20 backdrop-blur-sm">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 rounded-full bg-secondary group-hover:bg-[#915eff] mb-1 transition-colors duration-300"
            />
          </div>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
