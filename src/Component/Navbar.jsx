import React, { useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import {BookingNavigationLink as Link} from '../lib/BookingProduct.jsx';
import { Menu, X, ChevronDown, Calendar, Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import logoImg from "../assets/logos/Nav-Logo.webp";
import { publicServices } from "../data/publicServices";
import "./Navbar.css";

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

/**
 * Navbar Component
 * Rebuilt with a premium Cyberpunk/Dark Mode glassmorphism theme
 * featuring a "Neon Underline Sliding Tab" capsule indicator using Framer Motion.
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesMode, setServicesMode] = useState(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const servicesOpen = servicesMode !== null;
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const menuButtonRef = useRef(null);
  const servicesRef = useRef(null);
  const servicesButtonRef = useRef(null);

  const location = useLocation();

  const closeNavigation = () => {
    setIsOpen(false);
    setServicesMode(null);
    setMobileServicesOpen(false);
    setHoveredIdx(null);
  };
  const toggleMenu = () => {
    setIsOpen(open => !open);
    setMobileServicesOpen(false);
  };

  // Route changes and outside interactions dismiss the disclosure. A focused
  // trigger no longer forces the list to stay visible after navigation.
  useEffect(() => {
    setServicesMode(null);
    setMobileServicesOpen(false);
    setIsOpen(false);
    setHoveredIdx(null);
  }, [location.key]);

  useEffect(() => {
    const dismissOutside = event => {
      if (!servicesRef.current?.contains(event.target)) setServicesMode(null);
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, []);

  // Desktop and mobile share one six-service list and a separate index action.
  const serviceLinks = () => <>
    <Link to="/services" className="site-service-link site-service-link--all" onClick={closeNavigation}
      aria-current={location.pathname === "/services" ? "page" : undefined}>
      All Services <ArrowRight size={18} aria-hidden="true" />
    </Link>
    <ul>
      {publicServices.map(service => <li key={service.id}>
        <Link to={`/services/${service.id}`} className="site-service-link" onClick={closeNavigation}
          aria-current={location.pathname === `/services/${service.id}` ? "page" : undefined}>
          {service.title}
        </Link>
      </li>)}
    </ul>
  </>;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services", isDropdown: true },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" }
  ];

  const getActiveIdx = () => {
    if (location.pathname === "/") return 0;
    if (location.pathname === "/about") return 1;
    if (location.pathname === "/services" || location.pathname.startsWith("/services")) return 2;
    if (location.pathname === "/testimonials") return 3;
    if (location.pathname === "/contact") return 4;
    return null;
  };

  const activeIdx = getActiveIdx();
  const currentIndicatorIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  // Custom CSS variables for cyberpunk glassmorphic styling
  const navStyles = {
    "--nav-bg": "linear-gradient(to right, rgba(24, 17, 34, 0.95), rgba(6, 9, 27, 0.95))",
    "--nav-border": "rgba(171, 122, 87, 0.15)",
    "--pill-bg-start": "rgba(211, 175, 84, 0.12)",
    "--pill-bg-end": "rgba(211, 175, 84, 0.02)",
    "--pill-border": "rgba(211, 175, 84, 0.5)",
    "--pill-glow": "rgba(211, 175, 84, 0.2)"
  };

  return (
    <header
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        if (servicesOpen) {
          event.preventDefault();
          setServicesMode(null);
          servicesButtonRef.current?.focus();
        } else if (mobileServicesOpen) {
          event.preventDefault();
          setMobileServicesOpen(false);
          document.getElementById("mobile-services-trigger")?.focus();
        } else if (isOpen) {
          event.preventDefault();
          closeNavigation();
          menuButtonRef.current?.focus();
        }
      }}
      style={{
        background: "var(--nav-bg)",
        borderColor: "var(--nav-border)",
        backdropFilter: "blur(12px)",
        ...navStyles
      }}
      className="site-header w-full text-white border-b sticky top-0 z-50 shadow-[0_4px_30px_rgba(211,175,84,0.06)] transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="site-header-row flex items-center justify-between h-21">

          {/* Logo Section */}
          <Link to="/" className="site-header-brand flex items-center gap-1 pt-3 cursor-pointer group">
            <img
              src={logoImg}
              alt="Kundan Singh Logo"
              className="w-28 h-28 object-contain transition-transform duration-300 group-hover:scale-105"
            />

            {/* Vertical Alignment: Astroadvice by (above), Kundan Singh (below) */}
            <div className="flex flex-col justify-center text-left">
              <span className="site-header-brand-intro text-[10px] text-[#D8CFEB] tracking-widest uppercase font-medium leading-none transition-colors group-hover:text-white">
                Astroadvice by
              </span>
              <span className="site-header-brand-name text-lg md:text-xl font-bold text-[#D3AF54] font-serif tracking-wide mt-1 leading-none block transition-colors group-hover:text-gold-aura">
                Kundan Singh
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu (Horizontal Neon sliding pill indicator) */}
          <nav className="site-header-nav hidden lg:flex items-center gap-1.5 translate-y-1 relative">
            {navItems.map((item, idx) => {
              const isIndicatorActive = currentIndicatorIdx === idx;
              
              if (item.isDropdown) {
                return (
                  <div key={idx} ref={servicesRef} className="relative"
                    onMouseEnter={() => { setHoveredIdx(idx); setServicesMode(mode => mode || "hover"); }}
                    onMouseLeave={() => { setHoveredIdx(null); setServicesMode(null); }}
                    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesMode(null); }}>
                    {/* Parent Dropdown Link node — now a disclosure button, not a destination. */}
                    <button ref={servicesButtonRef} type="button" id="desktop-services-trigger"
                      className="site-services-trigger relative z-10 px-4 py-2 text-sm font-medium transition-colors text-slate-300 hover:text-white cursor-pointer"
                      aria-expanded={servicesOpen} aria-controls="desktop-service-links" data-active={activeIdx === idx}
                      onClick={() => setServicesMode(mode => mode === "press" ? null : "press")}
                      onKeyDown={event => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          setServicesMode("press");
                          requestAnimationFrame(() => document.querySelector("#desktop-service-links a")?.focus());
                        }
                      }}>
                      {item.name}<ChevronDown size={14} aria-hidden="true" className={servicesOpen ? "rotate-180" : ""} />
                    </button>
                    {/* Submenu Dropdown Panel — the padded bridge keeps pointer travel continuous. */}
                    {servicesOpen && <div id="desktop-service-links" className="site-services-dropdown" aria-labelledby="desktop-services-trigger">
                      <div className="site-services-panel">{serviceLinks()}</div>
                    </div>}
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Sliding Pill Indicator for active/hover states */}
                  {isIndicatorActive && (
                    <motion.div
                      layoutId="neonPill"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "linear-gradient(135deg, var(--pill-bg-start), var(--pill-bg-end))",
                        border: "1px solid var(--pill-border)",
                        boxShadow: "0 0 10px var(--pill-glow)"
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <Link
                    to={item.path}
                    className="relative z-10 px-4 py-2 block text-sm font-medium transition-colors text-slate-300 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Desktop Right Action Panel */}
          <div className="site-header-actions hidden lg:flex flex-col items-end gap-1 relative group">
            {/* Contact Phone */}
            <div className="site-header-contact flex items-center gap-2 text-[#D3AF54] text-xs font-semibold">
              <div className="site-header-phone-icon w-5 h-5 rounded-full bg-[#D3AF54] text-[#181122] flex items-center justify-center shadow-[0_0_8px_rgba(211,175,84,0.35)] shrink-0">
                <Phone size={10} className="fill-[#181122] text-[#181122]" />
              </div>
              <span className="site-header-phones tracking-wide"><span>+91 8130808758</span><span className="site-header-phone-separator"> | </span><span>+91 8527790801</span></span>
            </div>

            <div className="relative">
              {/* Booking Options CTA */}
              <MotionLink 
                to="/booking"
                whileHover={{ scale: 1.05, y: -1, boxShadow: "0 0 15px rgba(211, 175, 84, 0.45)" }}
                whileTap={{ scale: 0.98 }}
                className="site-header-booking bg-[#D3AF54] text-[#181122] font-semibold px-4 py-1.5 rounded-lg flex items-center gap-2 transition text-xs cursor-pointer shadow-[0_0_15px_rgba(211, 175, 84, 0.25)]"
              >
                <Calendar size={14} />
                Book Appointment
              </MotionLink>
              
              {/* Glowing ambient indicator and underline */}
              {location.pathname === "/booking" && (
                <>
                  {/* Underlight glow */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-[8px] bg-[#D3AF54] blur-[6px] rounded-full animate-pulse pointer-events-none" />
                  
                  {/* Underline bar */}
                  <motion.div 
                    layoutId="bookingGlow"
                    className="absolute -bottom-1.5 left-2 right-2 h-[2px] bg-[#D3AF54]"
                    style={{
                      boxShadow: "0 0 10px #D3AF54, 0 0 20px #D3AF54",
                      borderRadius: "9999px"
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Responsive Hamburger Toggle for Mobile/Tablet */}
          <button 
            ref={menuButtonRef}
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={toggleMenu}
            className="lg:hidden text-[#D3AF54] hover:text-[#D3AF54]/80 focus-visible:outline-2 focus-visible:outline-offset-2 min-w-11 min-h-11 flex items-center justify-center cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Panel (Slide down overlay) */}
      {isOpen && (
        <div id="mobile-navigation" style={{ maxHeight: "calc(100dvh - var(--header-unit) * 5.25 - 1px)" }} className="lg:hidden overflow-y-auto overscroll-contain bg-[#181122]/95 border-t border-white/10 py-4 px-6 space-y-4 shadow-inner backdrop-blur-md">
          <div className="flex flex-col gap-2 relative">
            {navItems.map((item, idx) => {
              const isIndicatorActive = currentIndicatorIdx === idx;

              if (item.isDropdown) {
                return (
                  <div key={idx} className="relative w-full">
                    <button type="button" id="mobile-services-trigger"
                      className="site-services-trigger relative z-10 w-full px-4 py-2.5 min-h-11 justify-between text-sm font-medium text-slate-300 cursor-pointer"
                      aria-expanded={mobileServicesOpen} aria-controls="mobile-service-links" data-active={activeIdx === idx}
                      onClick={() => setMobileServicesOpen(open => !open)}>
                      Services <ChevronDown size={16} aria-hidden="true" className={mobileServicesOpen ? "rotate-180" : ""} />
                    </button>
                    {mobileServicesOpen && <div id="mobile-service-links" className="site-services-mobile" aria-labelledby="mobile-services-trigger">
                      {serviceLinks()}
                    </div>}
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="relative w-full"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {isIndicatorActive && (
                    <motion.div
                      layoutId="active-pill-mobile"
                      style={{
                        background: "linear-gradient(135deg, var(--pill-bg-start), var(--pill-bg-end))",
                        borderColor: "var(--pill-border)",
                        boxShadow: "0 0 20px var(--pill-glow)",
                      }}
                      className="absolute inset-0 border rounded-xl pointer-events-none"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Link
                    to={item.path}
                    onClick={closeNavigation}
                    className="relative z-10 px-4 py-2.5 block text-sm font-medium transition-colors text-slate-300 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Drawer Call Actions Footer */}
          <div className="border-t border-white/10 pt-4 flex flex-col items-center gap-2">
            {/* Phone */}
            <div className="flex items-center gap-2 text-[#D3AF54] text-sm font-medium">
              <div className="w-6 h-6 rounded-full bg-[#D3AF54] text-[#181122] flex items-center justify-center shadow-[0_0_8px_rgba(211,175,84,0.35)] shrink-0">
                <Phone size={12} className="fill-[#181122] text-[#181122]" />
              </div>
              <span>+91 8130808758 | +91 8527790801</span>
            </div>

            {/* CTA Button */}
            <Link 
              to="/booking"
              onClick={closeNavigation}
              className="bg-[#D3AF54] hover:bg-[#D3AF54]/90 text-[#181122] font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition text-sm w-full shadow-[0_0_15px_rgba(211, 175, 84, 0.25)]"
            >
              <Calendar size={16} />
              Booking Options
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
