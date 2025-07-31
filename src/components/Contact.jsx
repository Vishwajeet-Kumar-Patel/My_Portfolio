import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useInView } from "react-intersection-observer";
import { styles } from "../style";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const { ref: canvasRef, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (inView) setShowCanvas(true);
  }, [inView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        "service_hzxz0ue",
        "template_ma5zl9n",
        {
          from_name: form.name,
          to_name: "Vishwajeet",
          from_email: form.email,
          to_email: "vishwajeetcenation@gmail.com",
          message: form.message,
        },
        "7KoueMituwkPgfMtT"
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you. I will get back to you as soon as possible.");
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.log(error);
          alert("Something went wrong");
        }
      );
  };

  return (
    <div className="flex flex-col gap-6 xs:gap-8 sm:gap-10 overflow-hidden">
      {/* Earth Canvas - Now at the top */}
      <motion.div
        ref={canvasRef}
        variants={slideIn("down", "tween", 0.1, 1)}
        className="w-full h-[250px] xs:h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px]"
      >
        {showCanvas && <EarthCanvas />}
      </motion.div>

      {/* Contact Form */}
      <motion.div
        variants={slideIn("up", "tween", 0.2, 1)}
        className="w-full bg-black-100 p-4 xs:p-6 sm:p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in Touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-8 xs:mt-10 sm:mt-12 flex flex-col gap-6 xs:gap-7 sm:gap-8"
        >
          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 xs:mb-4 text-[14px] xs:text-[16px]">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className="bg-tertiary py-3 px-4 xs:py-4 xs:px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium text-[14px] xs:text-[16px]"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 xs:mb-4 text-[14px] xs:text-[16px]">Your Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              className="bg-tertiary py-3 px-4 xs:py-4 xs:px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium text-[14px] xs:text-[16px]"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 xs:mb-4 text-[14px] xs:text-[16px]">Your Message</span>
            <textarea
              rows="6"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              className="bg-tertiary py-3 px-4 xs:py-4 xs:px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-none font-medium text-[14px] xs:text-[16px] resize-none"
            />
          </label>
          <button
            type="submit"
            className="bg-tertiary py-3 px-6 xs:py-4 xs:px-8 sm:py-5 sm:px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl text-[14px] xs:text-[16px] hover:bg-opacity-80 transition-all duration-300"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>

        <div className="mt-8 xs:mt-10 flex justify-center gap-4 xs:gap-6">
          <a
            href="https://www.instagram.com/vishwajeet_kumar_patel/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xl xs:text-2xl hover:text-pink-500 transition-colors duration-300 p-2 hover:scale-110"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/vishwajeet-kumar-00b817239/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xl xs:text-2xl hover:text-blue-500 transition-colors duration-300 p-2 hover:scale-110"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://x.com/the_dead_vibe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xl xs:text-2xl hover:text-gray-400 transition-colors duration-300 p-2 hover:scale-110"
          >
            <FaXTwitter />
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
