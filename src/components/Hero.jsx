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
      className="relative w-full h-screen mx-auto bg-gradient-to-b from-black via-[#0f0f1f] to-black"
    >
      {/* Text Content */}
      <div
        className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-col sm:flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915eff]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-white text-[48px] sm:text-[64px] font-bold leading-tight">
            <br></br>
            Hello, I'm{" "}
            <span className="text-[#915eff] drop-shadow-lg">
              Vishwajeet Kumar
            </span>
          </h1>
          <p className="mt-4 text-white-100 text-[18px] sm:text-[20px] leading-relaxed max-w-xl">
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
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full flex justify-center items-center"
        >
          <ComputersCanvas />
        </motion.div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
