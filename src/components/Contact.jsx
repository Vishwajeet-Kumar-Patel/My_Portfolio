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
  const [status, setStatus] = useState("");
  const { ref: canvasRef, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (inView) setShowCanvas(true);
  }, [inView]);

  const validateForm = () => {
    if (!form.name.trim()) {
      setStatus("error");
      alert("Please enter your name");
      return false;
    }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setStatus("error");
      alert("Please enter a valid email address");
      return false;
    }
    if (!form.message.trim()) {
      setStatus("error");
      alert("Please enter your message");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (status === "error") setStatus(""); // Clear error status when user starts typing
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setStatus("sending");

    // Email 1: Send notification to YOU with user's actual message
    const notificationData = {
      to_email: "vishwajeetcenation@gmail.com", // Goes to you
      from_name: form.name,
      from_email: form.email,
      to_name: "Vishwajeet Kumar",
      
      // Try multiple variable names that EmailJS template might use
      name: form.name,
      email: form.email,
      message: form.message, // User's RAW message
      user_name: form.name,
      user_email: form.email,
      user_message: form.message,
      contact_name: form.name,
      contact_email: form.email,
      contact_message: form.message,
      
      // Override the template message with actual user data
      subject: `Portfolio Contact from ${form.name}`,
      reply_to: form.email,
      
      // If template uses 'body' field
      body: form.message,
      
      // Complete formatted version as backup
      formatted_message: `NEW CONTACT FROM PORTFOLIO:

Name: ${form.name}
Email: ${form.email} 
Date: ${new Date().toLocaleString()}

User's Message:
"${form.message}"

---
You can reply directly to ${form.email}`,
    };

    console.log("📧 Sending notification to admin with RAW USER MESSAGE:", {
      recipient: notificationData.to_email,
      sender: notificationData.from_email,
      subject: notificationData.subject,
      actual_user_message: form.message, // This should appear in your email
      raw_message_field: notificationData.message,
      all_message_fields: {
        message: notificationData.message,
        user_message: notificationData.user_message,
        body: notificationData.body,
        contact_message: notificationData.contact_message
      }
    });

    emailjs
      .send(
        "service_hzxz0ue", 
        "template_ma5zl9n", 
        notificationData,
        "7KoueMituwkPgfMtT"
      )
      .then((response) => {
        console.log("✅ Notification sent to admin successfully:", response);
        
        // Email 2: Send confirmation to USER
        const userConfirmationData = {
          to_email: form.email, // Goes to USER
          from_name: "Vishwajeet Kumar",
          from_email: "vishwajeetcenation@gmail.com",
          to_name: form.name,
          user_name: form.name,
          message: `Hi ${form.name},

Thank you for reaching out through my portfolio! 

I have received your message and will get back to you within 24-48 hours.

Best regards,
Vishwajeet Kumar

---
This is an automated confirmation email.`,
          subject: "Thank you for contacting me - Vishwajeet Kumar",
          reply_to: "vishwajeetcenation@gmail.com",
        };

        console.log("📧 Sending confirmation to user:", {
          recipient: userConfirmationData.to_email,
          sender: userConfirmationData.from_email,
          subject: userConfirmationData.subject
        });

        return emailjs.send(
          "service_hzxz0ue",
          "template_ma5zl9n", 
          userConfirmationData,
          "7KoueMituwkPgfMtT"
        );
      })
      .then((response) => {
        console.log("✅ Confirmation sent to user successfully:", response);
        setLoading(false);
        setStatus("success");
        alert(`✅ Thank you ${form.name}! Your message has been sent successfully. You should receive a confirmation email at ${form.email}. I'll get back to you within 24-48 hours.`);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(""), 5000);
      })
      .catch((error) => {
        console.error("❌ EmailJS Error:", error);
        
        // Fallback: At least send notification to you
        emailjs.send(
          "service_hzxz0ue", 
          "template_ma5zl9n", 
          notificationData,
          "7KoueMituwkPgfMtT"
        ).then(() => {
          setLoading(false);
          setStatus("success");
          alert("✅ Your message has been sent successfully! (Confirmation email may be delayed)");
          setForm({ name: "", email: "", message: "" });
          setTimeout(() => setStatus(""), 5000);
        }).catch(() => {
          setLoading(false);
          setStatus("error");
          alert(`❌ Error sending email. Please contact me directly at vishwajeetcenation@gmail.com\n\nYour message: "${form.message}"`);
          setTimeout(() => setStatus(""), 5000);
        });
      });
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
            <span className="text-white font-medium mb-3 xs:mb-4 text-[14px] xs:text-[16px]">
              Your Name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              required
              className={`bg-tertiary py-3 px-4 xs:py-4 xs:px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-2 font-medium text-[14px] xs:text-[16px] transition-colors duration-300 ${
                status === "error" && !form.name.trim() 
                  ? "border-red-500" 
                  : "border-transparent focus:border-[#915eff]"
              }`}
            />
          </label>
          
          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 xs:mb-4 text-[14px] xs:text-[16px]">
              Your Email <span className="text-red-500">*</span>
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              required
              className={`bg-tertiary py-3 px-4 xs:py-4 xs:px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-2 font-medium text-[14px] xs:text-[16px] transition-colors duration-300 ${
                status === "error" && (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
                  ? "border-red-500" 
                  : "border-transparent focus:border-[#915eff]"
              }`}
            />
          </label>
          
          <label className="flex flex-col">
            <span className="text-white font-medium mb-3 xs:mb-4 text-[14px] xs:text-[16px]">
              Your Message <span className="text-red-500">*</span>
            </span>
            <textarea
              rows="6"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              required
              className={`bg-tertiary py-3 px-4 xs:py-4 xs:px-6 placeholder:text-secondary text-white rounded-lg outlined-none border-2 font-medium text-[14px] xs:text-[16px] resize-none transition-colors duration-300 ${
                status === "error" && !form.message.trim()
                  ? "border-red-500" 
                  : "border-transparent focus:border-[#915eff]"
              }`}
            />
          </label>
          
          <button
            type="submit"
            disabled={loading}
            className={`py-3 px-6 xs:py-4 xs:px-8 sm:py-5 sm:px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl text-[14px] xs:text-[16px] transition-all duration-300 ${
              loading 
                ? "bg-gray-600 cursor-not-allowed" 
                : status === "success"
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gradient-to-r from-[#915eff] to-[#7c3aed] hover:from-[#7c3aed] hover:to-[#915eff] hover:scale-105"
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </div>
            ) : status === "success" ? (
              "✅ Sent Successfully!"
            ) : (
              "Send Message"
            )}
          </button>
          
          {/* Status Messages */}
          {status === "success" && (
            <div className="text-green-400 text-sm font-medium">
              ✅ Message sent successfully! I'll get back to you soon.
            </div>
          )}
          {status === "error" && (
            <div className="text-red-400 text-sm font-medium">
              ❌ Please check your inputs and try again.
            </div>
          )}
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
