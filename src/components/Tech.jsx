import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-4 xs:gap-6 sm:gap-8 md:gap-10">
      {technologies.map((technology, index) => (
        <LazyBallCanvas key={technology.name} icon={technology.icon} />
      ))}
    </div>
  );
};

const LazyBallCanvas = ({ icon }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (inView) setShowCanvas(true);
  }, [inView]);

  return (
    <div ref={ref} className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28">
      {showCanvas && <BallCanvas icon={icon} />}
    </div>
  );
};

export default SectionWrapper(Tech, "");
