import React, { useState, useEffect, useRef } from 'react'

import {BookingLink as Link} from '../lib/BookingProduct.jsx';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import aboutImg from '../assets/images/About.png'
import './About.css'
import { publicServices } from '../data/publicServices'
import { ServiceFocus } from './ServicePresentation'

import { 
  Award, 
  Users, 
  Globe, 
  Star, 
  Sparkles, 
  Calendar, 
  Phone, 
  FileText, 
  Heart, 
  Briefcase, 
  Gem, 
  Hash, 
  Home as HomeIcon,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react'

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

/**
 * CelestialDivider Component
 * Elegant visual separator designed with gold gradient lines and a central star symbol.
 */
function CelestialDivider() {
  return (
    <div className="w-full flex items-center justify-center py-10 gap-4">
      <div className="h-[1px] flex-grow max-w-[150px] bg-gradient-to-r from-transparent to-[#fcb900]/40"></div>
      <div className="text-[#fcb900]/50 text-xs tracking-widest select-none">✦ ❖ ✦</div>
      <div className="h-[1px] flex-grow max-w-[150px] bg-gradient-to-l from-transparent to-[#fcb900]/40"></div>
    </div>
  )
}




/**
 * About Component
 * Premium luxury About page for Astrologer Kundan Singh.
 */
function About() {
  const pageRef = useRef(null)

  // Measure the existing header and overlapping tray without changing shared chrome sizing.
  useEffect(() => {
    const header = document.querySelector('header')
    const proof = pageRef.current?.querySelector('.about-proof')
    if (!header || !proof) return
    const updateSceneSize = () => {
      pageRef.current?.style.setProperty('--about-header-height', `${header.getBoundingClientRect().height}px`)
      pageRef.current?.style.setProperty('--about-proof-half', `${proof.getBoundingClientRect().height / 2}px`)
    }
    const observer = new ResizeObserver(updateSceneSize)
    observer.observe(header)
    observer.observe(proof)
    updateSceneSize()
    return () => observer.disconnect()
  }, [])

  const { scrollY } = useScroll()
  const yLeft = useTransform(scrollY, [0, 1000], [0, -30])
  const yRight = useTransform(scrollY, [0, 1000], [0, -70])
  const yZodiac = useTransform(scrollY, [0, 1000], [0, -90])
  const rZodiac = useTransform(scrollY, [0, 1000], [0, 45])
  const yCertZodiac = useTransform(scrollY, [300, 1500], [40, -60])
  const rCertZodiac = useTransform(scrollY, [300, 1500], [0, 30])

  // Expertise Section Grid Data (6 premium cards)
  const expertiseData = publicServices



  // Certificates Data (Marquee)
  const certificatesData = [
    { name: "Gold Medalist in Vedic Astrology" },
    { name: "Acharya of Jyotish Shastra" },
    { name: "Advanced Horoscopy & Transit Specialist" },
    { name: "Vastu Shastra Visharad Certification" },
    { name: "Spiritual Counseling Diplomate" },
    { name: "Certified Numerologist (SICA)" }
  ]

  const [certIndex, setCertIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCertIndex((prev) => (prev + 1) % certificatesData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [certificatesData.length]);

  return (
    <div ref={pageRef} className="about-page w-full bg-[#FDFCF5] relative flex flex-col items-center font-sans">
      
      {/* ========================================================= */}
      {/* 1. INTRO / BIOGRAPHY DEEP SPACE BAND SECTION (Navy: #06091B) */}
      {/* ========================================================= */}
      <div className="about-hero w-full bg-[#06091B] relative overflow-hidden flex flex-col items-center border-b border-[#AB7A57]/20 text-white z-10">
        
        {/* Glow & Luxury SVG Decor Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(171,122,87,0.1),transparent_70%)] rounded-full -z-10 pointer-events-none animate-pulse"></div>
        <motion.div style={{ y: yZodiac, rotate: rZodiac, willChange: 'transform' }} className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04] flex justify-center items-center">
          <svg className="w-[500px] h-[500px] text-[#AB7A57] animate-[spin_200s_linear_infinite]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.4">
            <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="70" />
            <circle cx="100" cy="100" r="50" strokeDasharray="2 2" />
            <line x1="100" y1="10" x2="100" y2="190" />
            <line x1="10" y1="100" x2="190" y2="100" />
          </svg>
        </motion.div>

        {/* Capped layout wrapper inside band */}
        <div className="about-container about-hero-shell w-full max-w-[2400px] mx-auto px-[clamp(1.5rem,4vw,4.5rem)] flex flex-col items-center">
          
          <section className="about-hero-section w-full min-h-0 py-10 md:py-16 flex items-center relative z-10">
            {/* Main Asymmetric Board */}
            <div className="about-hero-layout grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
            
            {/* Left Column: Bio Content cards (reversing typical positions) */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              className="about-hero-copy lg:col-span-7 lg:order-1 order-2 flex flex-col text-left justify-start gap-5"
            >
              {/* Hero Header Title and Subtitle */}
              <div className="about-hero-heading space-y-3.5 flex flex-col items-start text-left">
                <div className="about-hero-label inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D3AF54]/40 bg-[#D3AF54]/10 text-[#D3AF54] text-[10px] sm:text-xs font-semibold uppercase tracking-widest font-sans w-fit shadow-[0_0_15px_rgba(211,175,84,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D3AF54] animate-pulse"></span>
                  <span>Meet The Astrologer</span>
                </div>
                <h1 className="about-hero-title font-serif font-bold leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex flex-wrap items-baseline gap-x-3 text-left">
                  <span 
                    style={{
                      background: 'linear-gradient(135deg, #FFFDEE 0%, #D3AF54 50%, #AB7A57 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block'
                    }}
                    className="text-[clamp(1.3rem,2.5vw,2.6rem)] font-light tracking-wide shrink-0"
                  >
                    Astrologer
                  </span>
                  <span 
                    style={{
                      background: 'linear-gradient(135deg, #FFFDEE 0%, #D3AF54 50%, #AB7A57 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block'
                    }}
                    className="text-[clamp(2.2rem,4.5vw,4.8rem)] tracking-wide"
                  >
                    Kundan Singh
                  </span>
                </h1>
                <p className="about-hero-description text-[#EBDCD4] text-xs sm:text-sm leading-relaxed max-w-xl font-sans font-light border-l-2 border-[#D3AF54]/40 pl-4 py-0.5">
                  Bridging ancient Vedic wisdom with modern practical insights to light your path to clarity, purpose, and alignment.
                </p>
              </div>
              {/* Redesigned compact bullet points wrapper block */}
              <div className="about-bio-points grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 shadow-inner">
                <div className="flex gap-3 items-start">
                  <span className="text-[#D3AF54] text-xs mt-1 shrink-0">✦</span>
                  <div className="flex flex-col text-left">
                    <span className="text-white font-serif font-bold text-xs sm:text-sm">15+ Years of Experience</span>
                    <span className="text-[11px] sm:text-xs text-[#D8CFEB] font-sans">Trusted alignments since 2003.</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-[#D3AF54] text-xs mt-1 shrink-0">✦</span>
                  <div className="flex flex-col text-left">
                    <span className="text-white font-serif font-bold text-xs sm:text-sm">Academic Foundation</span>
                    <span className="text-[11px] sm:text-xs text-[#D8CFEB] font-sans">Formal studies at Bharatiya Vidya Bhavan.</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-[#D3AF54] text-xs mt-1 shrink-0">✦</span>
                  <div className="flex flex-col text-left">
                    <span className="text-white font-serif font-bold text-xs sm:text-sm">Comprehensive Focus</span>
                    <span className="text-[11px] sm:text-xs text-[#D8CFEB] font-sans">Vedic Kundli, Numerology, Vastu & Lal Kitaab.</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-[#D3AF54] text-xs mt-1 shrink-0">✦</span>
                  <div className="flex flex-col text-left">
                    <span className="text-white font-serif font-bold text-xs sm:text-sm">Practical Remedies</span>
                    <span className="text-[11px] sm:text-xs text-[#D8CFEB] font-sans">Actionable remedies for alignments.</span>
                  </div>
                </div>
              </div>

              {/* Quote Block or callout */}
              <div className="about-quote bg-white/5 border-l-2 border-[#D3AF54] rounded-r-2xl p-5 text-xs sm:text-sm text-[#D8CFEB] leading-relaxed font-sans italic bg-gradient-to-r from-white/5 to-transparent">
                "Our readings are not just predictions; they are strategic pathways designed to empower you with choices that align with your ultimate strengths."
              </div>

              {/* Action Buttons */}
              <div className="about-hero-actions flex flex-wrap gap-4 pt-2">
                <MotionLink 
                  to="/booking" 
                  whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 25px rgba(211, 175, 84, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 450, damping: 15 }}
                  className="bg-[#D3AF54] hover:bg-[#D3AF54]/90 text-[#181122] font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer text-sm"
                >
                  <Calendar size={18} />
                  <span>Book Consultation</span>
                </MotionLink>

                <motion.a 
                  href="https://wa.me/918527790801" 
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.03, y: -2, boxShadow: "0 10px 20px rgba(211, 175, 84, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 450, damping: 15 }}
                  className="border border-[#AB7A57] hover:border-[#D3AF54] text-white hover:text-[#D3AF54] font-semibold px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer text-sm bg-white/[0.02]"
                >
                  <MessageCircle size={18} className="text-[#D3AF54]" />
                  <span>Chat Now</span>
                </motion.a>
              </div>

            </motion.div>

            {/* Right Column: Portal-framed Portrait (reversing typical positions) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="about-hero-portrait lg:col-span-5 lg:order-2 order-1 flex justify-center relative w-full pt-2 lg:pt-4 lg:-translate-y-8 lg:scale-105"
            >
              {/* Elegant Archway/Temple Portal Frame */}
              <div className="about-portrait-frame relative w-[clamp(15rem,24vw,22rem)] aspect-[3/4] rounded-t-full border-2 border-[#D3AF54] bg-[#181122] shadow-[0_20px_50px_rgba(211,175,84,0.25)] overflow-hidden flex items-center justify-center group z-10">
                <img 
                  src={aboutImg} 
                  alt="Astrologer Kundan Singh" 
                  className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 absolute inset-0"
                />
                
                {/* Subtle internal gold gradient frame overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#181122]/70 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Decorative celestial background rings behind the archway */}
              <div className="absolute w-[112%] h-[112%] top-[6%] border border-dashed border-[#AB7A57]/20 rounded-t-full pointer-events-none animate-[spin_320s_linear_infinite]"></div>
              <div className="absolute w-[104%] h-[104%] top-[2%] border border-[#D3AF54]/10 rounded-t-full pointer-events-none"></div>
              
              {/* Constellation sparkle overlays */}
              <div className="absolute top-0 right-4 text-[#D3AF54]/50 animate-pulse"><Sparkles size={20} /></div>
              <div className="absolute bottom-20 left-4 text-[#AB7A57]/40"><Sparkles size={16} /></div>
            </motion.div>

            </div>
          </section>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2. EXPERTISE SECTION (White background: bg-white)         */}
      {/* ========================================================= */}
      <div className="about-proof-band w-full bg-white flex flex-col items-center relative z-30">
        
        {/* Floating Glassmorphic Stat bar sitting exactly at the boundary (Responsive spacing to prevent overlap) */}
        <div className="about-proof w-full max-w-2xl mx-auto px-4 sm:px-6 relative z-30 mt-10 lg:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="about-proof-grid w-full bg-[#FDFCF5] border border-[#AB7A57]/30 rounded-3xl p-1.5 py-2 sm:p-3 sm:py-3 shadow-2xl relative overflow-hidden grid grid-cols-3 gap-1.5 sm:gap-4 text-center z-30"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(171,122,87,0.04),transparent_70%)] pointer-events-none"></div>
            
            {/* Box 1: Experience */}
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 pt-1 pb-0.5 px-1 sm:pt-1.5 sm:pb-1 sm:px-2 lg:pt-2 lg:pb-1.5 lg:px-3 bg-[#06091B] border border-[#AB7A57]/30 rounded-xl w-full text-center lg:text-left shadow-md animate-none">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#AB7A57]/45 flex items-center justify-center text-[#D3AF54] bg-white/[0.03] shrink-0">
                <Award size={12} className="lg:w-3.5 lg:h-3.5" />
              </div>
              <div className="flex flex-col items-center lg:items-start min-w-0 w-full">
                <span className="text-[8px] sm:text-[10px] lg:text-xs uppercase text-[#D3AF54] tracking-wider font-semibold w-full text-center lg:text-left lg:whitespace-nowrap">Experience</span>
                <span className="text-[9px] sm:text-[11px] lg:text-sm font-bold text-white font-serif mt-0.5 lg:mt-0.5 w-full text-center lg:text-left lg:whitespace-nowrap">15+ Years</span>
              </div>
            </div>

            {/* Box 2: Consultations */}
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 pt-1 pb-0.5 px-1 sm:pt-1.5 sm:pb-1 sm:px-2 lg:pt-2 lg:pb-1.5 lg:px-3 bg-[#06091B] border border-[#AB7A57]/30 rounded-xl w-full text-center lg:text-left shadow-md animate-none">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#AB7A57]/45 flex items-center justify-center text-[#D3AF54] bg-white/[0.03] shrink-0">
                <Users size={12} className="lg:w-3.5 lg:h-3.5" />
              </div>
              <div className="flex flex-col items-center lg:items-start min-w-0 w-full">
                <span className="text-[8px] sm:text-[10px] lg:text-xs uppercase text-[#D3AF54] tracking-wider font-semibold w-full text-center lg:text-left lg:whitespace-nowrap">Consultations</span>
                <span className="text-[9px] sm:text-[11px] lg:text-sm font-bold text-white font-serif mt-0.5 lg:mt-0.5 w-full text-center lg:text-left lg:whitespace-nowrap">10,000+</span>
              </div>
            </div>

            {/* Box 4: Rating */}
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 pt-1 pb-0.5 px-1 sm:pt-1.5 sm:pb-1 sm:px-2 lg:pt-2 lg:pb-1.5 lg:px-3 bg-[#06091B] border border-[#AB7A57]/30 rounded-xl w-full text-center lg:text-left shadow-md animate-none">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#AB7A57]/45 flex items-center justify-center text-[#D3AF54] bg-white/[0.03] shrink-0">
                <Star size={12} className="fill-[#D3AF54] text-[#D3AF54] lg:w-3.5 lg:h-3.5" />
              </div>
              <div className="flex flex-col items-center lg:items-start min-w-0 w-full">
                <span className="text-[8px] sm:text-[10px] lg:text-xs uppercase text-[#D3AF54] tracking-wider font-semibold w-full text-center lg:text-left lg:whitespace-nowrap">Rating</span>
                <span className="text-[9px] sm:text-[11px] lg:text-sm font-bold text-white font-serif mt-0.5 lg:mt-0.5 w-full text-center lg:text-left lg:whitespace-nowrap">4.9 / 5.0</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>



      {/* ========================================================= */}
      {/* 2.1 AREAS OF EXPERTISE CONTENT                           */}
      {/* ========================================================= */}
      <div className="about-expertise w-full bg-white border-b border-[#AB7A57]/10 flex flex-col items-center relative py-12 rounded-t-[2.5rem] -mt-10 shadow-[0_-20px_40px_-15px_rgba(24,17,34,0.12)] z-10">
        
        {/* Inner container to capture absolute radial leakages safely */}
        <div className="about-expertise-shell w-full relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-1/3 left-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(171,122,87,0.04),transparent_70%)] rounded-full pointer-events-none animate-pulse"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="about-container about-expertise-content w-full max-w-[2400px] px-6 lg:px-8 flex flex-col items-center pt-8 sm:pt-10 pb-8 sm:pb-12"
          >
            
            {/* Section Header */}
            <div className="about-section-heading text-center max-w-3xl mb-6 md:mb-8 relative z-10">
              <span className="about-section-label text-[#AB7A57] text-xs tracking-[0.25em] uppercase font-bold block mb-3 font-sans">
                ✦ AREAS OF EXPERTISE ✦
              </span>
              <h2 className="about-section-title text-[clamp(1.3rem,2.2vw,2.2rem)] lg:text-3xl font-serif text-[#181122] font-bold mb-3 tracking-wide leading-tight lg:whitespace-nowrap">
                Divine Methods of Guidance
              </h2>
              <div className="w-12 h-[1px] bg-[#D3AF54] mx-auto mt-3 mb-3"></div>
              <p className="text-xs md:text-sm text-[#181122] font-sans leading-relaxed italic">
                "Comprehensive guidance for every important aspect of life."
              </p>
            </div>

            {/* The original centered layout is retained on mobile; landscape uses a compact 3 × 2 grid. */}
            <div className="about-expertise-grid w-full max-w-5xl z-10 flex flex-wrap justify-center gap-6 px-4">
              {expertiseData.map((item) => (
                <div key={item.title} className="about-expertise-item w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-[320px]">
                  <FeatureCard feature={item} />
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>



      {/* ========================================================= */}
      {/* 4. PROFESSIONAL CERTIFICATES (Warm Sand background: #EDE9D7)*/}
      {/* ========================================================= */}
      <div className="about-certificates w-full bg-[#EDE9D7] flex justify-center py-16 overflow-hidden relative border-b border-[#AB7A57]/10 rounded-t-[2.5rem] -mt-10 shadow-[0_-20px_40px_-15px_rgba(24,17,34,0.12)] z-10">
        
        {/* Parallax Background Zodiac Wheel outline */}
        <motion.div style={{ y: yCertZodiac, rotate: rCertZodiac, willChange: 'transform' }} className="absolute right-4 top-10 w-96 h-96 text-[#AB7A57]/5 pointer-events-none -z-10 select-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
            <circle cx="50" cy="50" r="45" strokeDasharray="1,1" />
            <circle cx="50" cy="50" r="30" />
            <path d="M 50 5 L 50 95 M 5 50 L 95 50 M 18 18 L 82 82 M 18 82 L 82 18" />
          </svg>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="about-container about-certificates-content w-full max-w-[2400px]"
        >
          
          <div className="about-section-heading w-full max-w-7xl mx-auto px-6 lg:px-8 mb-10 text-center">
            <span className="about-section-label text-[#AB7A57] text-xs tracking-[0.25em] uppercase font-bold block mb-3 font-sans">
              QUALIFICATIONS & ACCREDITATIONS
            </span>
            <h2 className="about-section-title text-[clamp(1.75rem,3.2vw,3.5rem)] font-serif text-[#181122] font-bold">
              Certificates
            </h2>
            <div className="w-12 h-[1px] bg-[#D3AF54] mx-auto mt-3"></div>
          </div>

          {/* Single-Card Slide Viewer */}
          <div className="about-certificates-viewer w-full max-w-[620px] mx-auto px-6 relative z-10 flex flex-col items-center">
            <div className="about-certificate-slot w-full min-h-[385px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={certIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="about-certificate-card w-full bg-[#181122] border border-[#D3AF54]/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 shadow-2xl relative justify-center"
                >
                  {/* Left Column: Big Image Frame Placeholder (Narrower & Taller) */}
                  <div className="about-certificate-image w-full md:w-[220px] h-[280px] bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-center items-center relative overflow-hidden shrink-0 group hover:border-[#D3AF54]/40 transition-colors duration-300">
                    {/* Celestial corner frames inside image placeholder */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#D3AF54]/30"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#D3AF54]/30"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#D3AF54]/30"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#D3AF54]/30"></div>
                    
                    <span className="text-5xl mb-3 filter drop-shadow-[0_0_10px_rgba(211,175,84,0.4)]">📜</span>
                    <span className="text-[10px] text-[#D8CFEB]/60 font-sans tracking-widest uppercase text-center px-4">CERTIFICATE IMAGE</span>
                  </div>

                  {/* Right Column: Details (Narrower) */}
                  <div className="about-certificate-copy flex-grow text-left flex flex-col justify-center py-2 max-w-md w-full">
                    <span className="text-[9px] tracking-widest text-[#D3AF54] font-sans font-bold uppercase block mb-3 border border-[#D3AF54]/30 bg-white/5 px-3 py-1 rounded-full w-fit">
                      VERIFIED ACCREDITATION
                    </span>
                    <h3 className="font-serif text-white font-bold text-lg leading-tight mb-3 tracking-wide group-hover:text-[#D3AF54] transition-colors duration-300">
                      {certificatesData[certIndex].name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#D8CFEB] leading-relaxed font-sans max-w-md">
                      This verified credential stands as a testament to the rigorous studies and complete mastery in Vedic sciences, birth charts mathematical calculations, and ancient energetic remedies.
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider Dots Navigation */}
            <div className="about-certificate-dots flex gap-2.5 mt-8 justify-center items-center">
              {certificatesData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCertIndex(idx)}
                  aria-pressed={certIndex === idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    certIndex === idx 
                      ? "bg-[#D3AF54] scale-125 shadow-[0_0_8px_rgba(211,175,84,0.8)]" 
                      : "bg-[#D3AF54]/20 hover:bg-[#D3AF54]/45"
                  }`}
                  aria-label={`Go to certificate ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </motion.div>
      </div>

    </div>
  )
}

// Helper cn function since tailwind-merge is not imported
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}) {
  const patternId = React.useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], index) => (
            <rect strokeWidth="0" key={index} width={width + 1} height={height + 1} x={x * width} y={y * height} />
          ))}
        </svg>
      )}
    </svg>
  );
}

function genRandomPattern(length) {
  length = length ?? 5;
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7, // random x between 7 and 10
    Math.floor(Math.random() * 6) + 1, // random y between 1 and 6
  ]);
}

function FeatureCard({ feature, className, ...props }) {
  const p = genRandomPattern();



  return (
    <div className={cn('about-expertise-card relative overflow-hidden p-5 bg-[#181122] border border-[#AB7A57]/30 rounded-3xl shadow-xl flex flex-col justify-between group hover:border-[#D3AF54]/50 transition-all duration-300 w-full text-white', className)} {...props}>
      {/* Decorative GridPattern overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
        <GridPattern
          width={20}
          height={20}
          x="-12"
          y="4"
          squares={p}
          className="fill-white/5 stroke-[#AB7A57]/15 absolute inset-0 h-full w-full mix-blend-overlay"
        />
      </div>

      {/* 1. Heading (top) */}
      <h3 
        className="text-base sm:text-lg font-serif font-bold text-center mb-4 tracking-wider uppercase block relative z-20 text-[#D3AF54] group-hover:text-white transition-colors duration-300 shrink-0"
      >
        {feature.title}
      </h3>

      <ServiceFocus service={feature} className="about-expertise-focus relative z-10" />

      {/* 2. Image (middle) */}
      <div className="about-expertise-image w-full aspect-[16/10] bg-white/5 border border-[#AB7A57]/20 rounded-2xl overflow-hidden mb-5 relative group z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 z-10 pointer-events-none"></div>
        <img 
          src={feature.image} 
          alt={feature.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-0"
        />
      </div>

      {/* 3. Action Buttons (bottom) */}
      <div className="about-expertise-actions flex gap-2.5 w-full mt-1 relative z-10">
        <Link 
          to={`/services/${feature.id}`}
          className="flex-grow border border-[#AB7A57]/60 hover:border-[#D3AF54] text-white hover:text-[#D3AF54] font-bold text-xs py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm bg-white/[0.02]"
        >
          Read More
        </Link>
        <Link 
          to={`/booking?service=${feature.id}`}
          className="flex-grow bg-[#D3AF54] hover:bg-[#D3AF54]/95 text-[#181122] font-bold text-xs py-2 px-3 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#D3AF54]/10"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}

export default About
