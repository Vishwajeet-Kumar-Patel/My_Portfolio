import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { styles } from "../style";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import Mylogo from "../assets/my-logo2.png";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-3 xs:py-4 sm:py-5 fixed top-0 z-20 transition-all duration-300 ${
        scrolled ? "bg-primary backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={Mylogo} alt="logo" className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 object-contain" />
          <p className="text-white text-[14px] xs:text-[16px] sm:text-[18px] font-bold cursor-pointer flex">
            Vishwajeet &nbsp; 
            <span className="hidden xs:inline">Kumar</span>
          </p>
        </Link>

        {/* Desktop Navigation */}
        <ul className="list-none hidden sm:flex flex-row gap-6 md:gap-8 lg:gap-10 items-center">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white" : "text-secondary"
              } hover:text-white text-[16px] md:text-[18px] font-medium cursor-pointer transition-colors duration-300`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}

          {/* Resume Button Desktop */}
          <li>
            <a
              href="/Vishwajeet_Kumar_Resume.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-white border border-white px-3 py-1 md:px-4 md:py-1.5 rounded-md text-[14px] md:text-[16px] font-medium hover:bg-white hover:text-black transition duration-300"
            >
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[24px] h-[24px] xs:w-[28px] xs:h-[28px] object-contain cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-4 xs:p-6 black-gradient absolute top-16 xs:top-20 right-0 mx-2 xs:mx-4 my-2 min-w-[140px] xs:min-w-[160px] z-10 rounded-xl shadow-lg`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-3 xs:gap-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[14px] xs:text-[16px] transition-colors duration-300 ${
                    active === nav.title ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}

              {/* Resume Button Mobile */}
              <li>
                <a
                  href="/Vishwajeet_Kumar_Resume.pdf"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white border border-white px-2 py-1 xs:px-3 xs:py-1 rounded-md text-[14px] xs:text-[16px] font-medium hover:bg-white hover:text-black transition duration-300"
                >
                  Resume
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
