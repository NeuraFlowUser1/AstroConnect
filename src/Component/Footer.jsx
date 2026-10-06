import React from 'react'

import {BookingNavigationLink as Link} from '../lib/BookingProduct.jsx';
import { Phone, CalendarClock } from "lucide-react";
import { motion } from 'framer-motion'
import logoImg from "../assets/logos/Nav-Logo.webp";
import fbLogo from "../assets/logos/facebook.webp";
import instaLogo from "../assets/logos/Instagram.webp";
import ytLogo from "../assets/logos/Youtube.webp";
import waLogo from "../assets/logos/whatsapp.webp";
import logo2Img from "../assets/logos/logo2.webp";
import gmailLogo from "../assets/logos/gmail.webp";
import mapsLogo from "../assets/logos/google-maps.webp";
import callLogo from "../assets/logos/Call.webp";
import './Footer.css';
 
/**
 * Footer Component
 * Full-width luxury footer designed with a deep purple gradient and gold accents.
 * Displays brand info, social channels, routing shortcuts, contact links, and decorative art.
 */
export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="site-footer w-full bg-[#06091B] text-[#D8CFEB] border-t border-[#AB7A57]/20 relative overflow-hidden pt-10 pb-6"
    >
      
      {/* Decorative Golden Stars Background */}
      <div className="absolute top-10 right-10 text-[#D3AF54]/10 text-3xl select-none pointer-events-none">✦</div>
      <div className="absolute bottom-20 left-10 text-[#D3AF54]/15 text-2xl select-none pointer-events-none">✨</div>
 
      {/* Main Footer Grid Layout */}
      <div className="footer-grid footer-container grid pb-10 border-b border-[#AB7A57]/10">
        
        {/* Column 1 — Brand Identity */}
        <div className="footer-brand space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Kundan Singh Logo"
              className="w-20 h-20 sm:w-22 sm:h-22 object-contain shrink-0"
            />
            <div className="flex flex-col text-left">
              <span className="footer-brand-eyebrow text-[#D8CFEB] tracking-widest uppercase font-medium leading-none">
                Astroadvice by
              </span>
              <span className="text-base sm:text-lg font-bold text-[#D3AF54] font-serif tracking-wide mt-1 leading-tight block">
                Kundan Singh
              </span>
            </div>
          </div>
          <p className="text-xs text-[#D8CFEB] leading-relaxed text-left">
            Guiding you towards a better tomorrow with the wisdom of Vedic Astrology.
          </p>
        </div>

        {/* Column 2 — Quick Links */}
        <div className="footer-quick-links space-y-4 text-left">
          <h4 className="font-serif font-bold !text-[#D3AF54] text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="text-[#D8CFEB] hover:text-[#D3AF54] transition">Home</Link></li>
            <li><Link to="/about" className="text-[#D8CFEB] hover:text-[#D3AF54] transition">About</Link></li>
            <li><Link to="/testimonials" className="text-[#D8CFEB] hover:text-[#D3AF54] transition">Testimonials</Link></li>
            <li><Link to="/contact" className="text-[#D8CFEB] hover:text-[#D3AF54] transition">Contact</Link></li>
            <li><Link to="/booking" className="text-[#D8CFEB] hover:text-[#D3AF54] transition">Book Consultation</Link></li>
          </ul>
        </div>
 
        {/* Column 3 — Astrological Services */}
        <div className="footer-services space-y-4 text-left">
          <h4 className="font-serif font-bold !text-[#D3AF54] text-sm uppercase tracking-wider">Services</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/services/vedic-astrology" className="text-[#D8CFEB] hover:text-[#D3AF54] transition">Vedic Astrology</Link></li>
            <li><Link to="/services/numerology" className="text-[#D8CFEB] hover:text-[#D3AF54] transition">General Numerology</Link></li>
            <li><Link to="/services/vastu" className="text-[#D8CFEB] hover:text-[#D3AF54] transition">Vastu Consultation</Link></li>
            <li><Link to="/services/laal-kitaab" className="text-[#D8CFEB] hover:text-[#D3AF54] transition">Laal Kitaab Remedies</Link></li>
            <li><Link to="/services/prashna-kundali" className="text-[#D8CFEB] hover:text-[#D3AF54] transition">Expertise in Prashna Kundli</Link></li>

          </ul>
        </div>
 
        {/* Column 4 — Contact Details */}
        <div className="footer-contact space-y-4 text-left">
          <h4 className="font-serif font-bold !text-[#D3AF54] text-sm uppercase tracking-wider">Contact Info</h4>
          <ul className="space-y-2.5 text-xs text-[#D8CFEB]">
            <li className="flex items-start gap-2.5">
              <div className="footer-contact-icon rounded-full bg-[#D3AF54] text-[#181122] flex items-center justify-center shadow-[0_0_8px_rgba(211,175,84,0.3)] mt-0.5">
                <Phone size={13} aria-hidden="true" className="fill-[#181122] text-[#181122]" />
              </div>
              <div className="flex flex-col space-y-0.5">
                <a href="tel:+918130808758" className="hover:text-[#D3AF54] transition font-medium">+91 8130808758</a>
                <a href="tel:+918527790801" className="hover:text-[#D3AF54] transition font-medium">+91 8527790801</a>
              </div>
            </li>
            <li className="flex items-center gap-2.5">
              <img src={gmailLogo} alt="Email" className="footer-contact-icon object-contain shadow-sm" />
              <span className="footer-email">astroadvicebyks@gmail.com</span>
            </li>
            <li className="flex items-start gap-2.5">
              <img src={mapsLogo} alt="Map" className="footer-contact-icon object-contain shadow-sm mt-0.5" />
              <a 
                href="https://www.google.com/maps/search/?api=1&query=B-23,+Shanti+Kunj,+Church+Road,+Vasant+Kunj,+New+Delhi,+Delhi+110070" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-[#D3AF54] transition leading-snug"
              >
                Vasant Kunj, New Delhi – 110070
              </a>
            </li>
          </ul>
        </div>

        {/* Column 5 — Visiting Hours and WhatsApp */}
        <div className="footer-hours space-y-4 text-left">
          <h4 className="font-serif font-bold !text-[#D3AF54] text-sm uppercase tracking-wider">Visiting Hours</h4>
          <ul className="space-y-4 text-xs text-[#D8CFEB]">
            <li className="flex items-start gap-2.5">
              <CalendarClock aria-hidden="true" strokeWidth={1.7} className="footer-contact-icon text-[#D3AF54] mt-0.5" />
              <span className="footer-schedule">
                <span>Monday–Saturday</span>
                <span>10 am–12 pm</span>
                <span>3 pm–6 pm</span>
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="footer-contact-icon footer-whatsapp-icon" aria-hidden="true">
                <img src={waLogo} alt="" />
              </span>
              <a href="https://wa.me/918527790801" target="_blank" rel="noreferrer" className="text-[#D8CFEB] hover:underline hover:text-[#D3AF54]">WhatsApp Live Chat</a>
            </li>
          </ul>
        </div>
 
        {/* Column 6 — Decorative Art */}
        <div className="footer-art hidden md:flex flex-col items-center justify-center relative w-full h-full">
          <div className="w-32 h-32 flex items-center justify-center relative">
            
            {/* Rotating Decorative Outer Circle */}
            <div className="absolute inset-0 rounded-full border border-[#D3AF54]/20 animate-[spin_120s_linear_infinite] pointer-events-none">
              <div className="absolute inset-1 rounded-full border border-dashed border-[#AB7A57]/30"></div>
              <div className="absolute inset-3 rounded-full border border-[#D3AF54]/20"></div>
              <div className="text-[7px] text-[#D3AF54]/40 font-serif absolute inset-0 flex justify-center items-center">
                <span className="absolute top-1">♈</span>
                <span className="absolute right-1">♋</span>
                <span className="absolute bottom-1">♎</span>
                <span className="absolute left-1">♑</span>
              </div>
            </div>

            {/* Static Centered Logo2 Image */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-[#181122]/90 flex items-center justify-center relative z-10 shadow-lg border border-[#D3AF54]/30">
              <img 
                src={logo2Img} 
                alt="Astroadvice Mark Logo" 
                className="w-full h-full object-contain p-1 rounded-full scale-125 transform"
              />
            </div>
            
          </div>
        </div>
 
      </div>
 
      {/* Footer Bottom Metadata Bar */}
      <div className="footer-container footer-bottom pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#D8CFEB]/85 gap-4">
        <div>
          <span>© 2026 Astroadvice. All Rights Reserved.</span>
        </div>
        
        {/* Permanent policy pages */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="/privacy-policy"
            className="text-[#D8CFEB] hover:text-[#D3AF54] transition cursor-pointer text-xs focus:outline-none"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="text-[#D8CFEB] hover:text-[#D3AF54] transition cursor-pointer text-xs focus:outline-none"
          >
            Terms & Conditions
          </Link>
          <Link
            to="/refund-policy"
            className="text-[#D8CFEB] hover:text-[#D3AF54] transition cursor-pointer text-xs focus:outline-none"
          >
            Refund Policy
          </Link>
        </div>
      </div>


    </motion.footer>
  )
}
