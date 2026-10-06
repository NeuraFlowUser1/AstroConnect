import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import {BookingLink as Link,BookingOnly} from '../lib/BookingProduct.jsx';
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Shield, Sparkles, ArrowLeft, Star, Gem, CheckCircle, ArrowRight, Home, Sofa, Bed, Utensils, Bath, Briefcase, Heart, RefreshCw, Globe, User, BookOpen, Compass, Send, Phone, MapPin, MessageSquare, Mail } from 'lucide-react'
import EmailOtpModal, {EnquiryResume} from './EmailOtpModal'
import NameChangeService from './NameChangeService'
import { publicServiceById } from '../data/publicServices'
import './ServiceDetail.css'

import {useEnquiry} from '../lib/useEnquiry.js'

import sunIcon from '../assets/planets/sun.webp'
import moonIcon from '../assets/planets/moon.webp'
import jupiterIcon from '../assets/planets/jupiter.webp'
import rahuIcon from '../assets/planets/rahu.webp'
import mercuryIcon from '../assets/planets/mercury.webp'
import venusIcon from '../assets/planets/venus.webp'
import ketuIcon from '../assets/planets/ketu.webp'
import saturnIcon from '../assets/planets/saturn.webp'
import marsIcon from '../assets/planets/mars.webp'

import earthImg from '../assets/elements/earth.webp'
import waterImg from '../assets/elements/water.webp'
import fireImg from '../assets/elements/fire.webp'
import airImg from '../assets/elements/air.webp'
import spaceImg from '../assets/elements/space.webp'

import vedicAstrologyImg from '../assets/images/Vedic Astrology.webp'
import numerologyImg from '../assets/images/Numerology.webp'
import vastuConsultationImg from '../assets/images/Vastu Consultation.webp'
import laalKitaabImg from '../assets/images/Laal Kitaab Remedies.webp'
import prashnaKundliImg from '../assets/images/Prashna Kundli.webp'


import solutionsLogo from '../assets/logos/solutions.webp'
import guidanceLogo from '../assets/logos/guidance.webp'
import accuracyLogo from '../assets/logos/accuracy.webp'
import transformationLogo from '../assets/logos/transformation.webp'
import clockLogo from '../assets/logos/clock.webp'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 }
  }
};

function ServiceBookingStrip({ serviceId, title = 'Ready to discuss this consultation?' }) {
  return <BookingOnly><section className="service-detail-cta" aria-label={`Book ${publicServiceById[serviceId]?.title || 'a consultation'}`}>
    <div><h2>{title}</h2><p>Choose a suitable day and time. The consultation type will already be selected.</p></div>
    <Link to={`/booking?service=${serviceId}`}><Calendar aria-hidden="true" />Book an Appointment</Link>
  </section></BookingOnly>;
}

const serviceDetails = {
  'vedic-astrology': {
    title: 'Vedic Astrology (Janam Kundli)',
    subtitle: 'Celestial Map of Your Life\'s Journey',
    image: vedicAstrologyImg,
    price: publicServiceById['vedic-astrology'].price,
    desc: 'Vedic Astrology is an ancient science that maps the exact positions of stars and planets at the time of your birth to read your life\'s blueprint. Through rigorous mathematics and classical scriptures, this reading decodes your natural strengths, karmic challenges, and the optimal timing for critical life choices.',
    process: [
      'Submit exact birth details (date, time, and city of birth).',
      'Calculations of planetary positions, Dasha cycles, and divisional charts.',
      'An interactive live video/audio consultation session.',
      'Final customized remedial report detailing Mantras, Vratas, and Gemstone suggestions.'
    ],
    benefits: [
      {
        title: 'Karmic Insights',
        desc: 'Understand why certain patterns repeat in your career or relationships and how to break them.'
      },
      {
        title: 'Perfect Timing',
        desc: 'Know when to take major risks in business, invest, buy property, or switch career fields.'
      },
      {
        title: 'Remedial Shielding',
        desc: 'Apply traditional planetary remedies to neutralize negative transits and Saturn cycles.'
      }
    ],
    story: {
      client: 'Rohan Sharma',
      text: 'I was stuck in a stagnant job during my Sade Sati period. Astrologer Kundan calculated my transits and suggested simple daily mantras. Within 3 months, my career direction cleared and I got a major promotion.',
      timeline: 'Career aligned in 90 Days'
    }
  },
  'numerology': {
    title: 'General Numerology',
    subtitle: 'Aligning Your Personal Vibrations',
    image: numerologyImg,
    price: publicServiceById.numerology.price,
    desc: 'Numbers are the fundamental frequencies of the universe. Numerology decodes the vibration of your date of birth and name spelling. By aligning these numbers, you can open doors to wealth, improve relationships, and remove hidden blockages from your daily path.',
    process: [
      'Provide current full name, signature details, and birth date.',
      'Analysis of core numbers: Life Path, Destiny, Soul Urge, and Personality.',
      'Verification of name spelling frequencies against birth chart.',
      'Correction suggestion for name spellings or brand names.'
    ],
    benefits: [
      {
        title: 'Name Spelling Alignment',
        desc: 'Align name spellings with birth numbers to attract natural success and lock-spelling benefits.'
      },
      {
        title: 'Vibrational Sync',
        desc: 'Find lucky dates for signing business contracts, launching products, or buying a home.'
      },
      {
        title: 'Life Path Clarity',
        desc: 'Discover your hidden talents, core motivations, and relationship compatibility levels.'
      }
    ],
    story: {
      client: 'Vikram Aditya',
      text: 'After changing my brand name spelling slightly based on Kundan\'s numerology calculations, our website conversion rate jumped by 40% and our customer trust increased.',
      timeline: '40% Growth in 2 Months'
    }
  },
  'vastu': {
    title: 'Vastu Consultation',
    subtitle: 'Harmonizing Elements in Your Living Space',
    image: vastuConsultationImg,
    price: publicServiceById.vastu.price,
    desc: 'Vastu Shastra is the ancient Indian science of architecture and spatial harmony. Every building has energy fields. By aligning rooms, entrances, and colors with elemental forces (Water, Fire, Earth, Space, Air), Vastu attracts positive energy, prosperity, and mental peace.',
    process: [
      'Provide layout blueprint or digital floor plan of the residential/commercial property.',
      'Elemental mapping and direction verification via compass directions.',
      'Custom spatial adjustment report highlighting imbalances.',
      'Practical, non-demolition remedies like mirrors, colors, metals, and object shifts.'
    ],
    benefits: [
      {
        title: 'Wealth Flow Enhancement',
        desc: 'Open up energy pathways to attract financial stability, credit clearing, and sales growth.'
      },
      {
        title: 'Health & Peace',
        desc: 'Clear stagnant elements that cause chronic stress, family disputes, or sleeplessness.'
      },
      {
        title: 'Business Growth',
        desc: 'Align commercial entrance, staff seating, and cash counter to maximize transaction rates.'
      }
    ],
    story: {
      client: 'Priya Kapoor',
      text: 'We had constant disputes and lack of energy in our new home. Kundan identified elemental imbalances in our north-east kitchen and entrance. Applying simple color corrections worked like magic.',
      timeline: 'Harmony restored in 15 Days'
    }
  },
  'laal-kitaab': {
    title: 'Laal Kitaab Remedies',
    subtitle: 'Simple & Practical Karmic Antidotes',
    image: laalKitaabImg,
    price: publicServiceById['laal-kitaab'].price,
    desc: 'Laal Kitaab is a unique branch of Vedic astrology famous for its simple, practical, and highly direct remedial measures. Instead of costly rituals or complex pujas, Laal Kitaab focuses on daily habit adjustments, food charity, and metal placements to ease planetary debts.',
    process: [
      'Chart analysis specifically focused on planetary debts (Rin).',
      'Identifying active house afflictions and adverse planetary aspects.',
      'Custom 43-day simple remedy sequence recommendation.',
      'Simple instructions (e.g., offering water, feeding birds, copper coin placements).'
    ],
    benefits: [
      {
        title: 'Direct Solutions',
        desc: 'Practical remedies that can be done easily at home or on-the-go.'
      },
      {
        title: 'Karmic Debt Relief',
        desc: 'Eases family debts, ancestral blockages, obstacles in marriage, and health issues.'
      },
      {
        title: 'Cost-Effective Measures',
        desc: 'No expensive rituals; uses basic natural elements and charity to restore peace.'
      }
    ],
    story: {
      client: 'Dr. Aarav Mehta',
      text: 'We had a long-standing property dispute. Kundan calculated my charts and suggested a simple 43-day copper coin remedy. The dispute settled amicably out of court.',
      timeline: 'Dispute Resolved in 43 Days'
    }
  },
  'prashna-kundali': {
    title: 'Prashna Kundali (Horary Astrology)',
    subtitle: 'Real-time Answers to Stagnant Questions',
    image: prashnaKundliImg,
    price: publicServiceById['prashna-kundali'].price + ' per question',
    desc: 'Horary astrology is used when exact birth details are unavailable, or when a quick answer is needed for a single, pressing question. The chart is cast for the exact second you ask the question, giving incredibly precise outcomes.',
    process: [
      'Formulate a single, sincere, and direct question in mind.',
      'Planetary map cast for the exact moment of inquiry and location.',
      'Immediate "Yes/No" analysis with timeline predictions.',
      'Advice on action steps based on planetary strength.'
    ],
    benefits: [
      {
        title: 'No Birth Details Needed',
        desc: 'Highly accurate even if you do not know your birth time or place.'
      },
      {
        title: 'Direct Answers',
        desc: 'Ideal for queries like \'Will I get this job?\', \'Should I travel?\', or \'Will my lost items return?\'.'
      },
      {
        title: 'Immediate Direction',
        desc: 'Get clear direction in times of confusion, deadlock, or rapid business decisions.'
      }
    ],
    story: {
      client: 'Amit Patel',
      text: 'I had to decide between two business partnerships immediately. Kundan used Prashna Kundali to tell me which partnership would be profitable. It saved me from a major financial trap.',
      timeline: 'Immediate decision clarity'
    }
  }
};

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [flippedCards, setFlippedCards] = useState({});
  const [activeAstrologyBenefit, setActiveAstrologyBenefit] = useState(0);
  const [activeLalKitaabTab, setActiveLalKitaabTab] = useState(0);

  const handleCardClick = (idx) => {
    setFlippedCards(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const details = serviceDetails[serviceId];

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  // Auto-advance benefit point every 3 seconds for Vedic Astrology
  useEffect(() => {
    if (serviceId === 'vedic-astrology') {
      const timer = setInterval(() => {
        setActiveAstrologyBenefit((prev) => (prev + 1) % 6);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [serviceId]);

  if (serviceId === 'name-change') return <NameChangeService />

  if (!details) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FDFCF5] px-6 text-[#181122]">
        <h1 className="text-2xl font-serif font-bold mb-4">Service Not Found</h1>
        <Link to="/" className="bg-[#D3AF54] text-[#181122] font-semibold px-6 py-2.5 rounded-xl text-sm uppercase">
          Back to Services
        </Link>
      </div>
    );
  }

  if (serviceId === 'numerology') {
    return (
      <div className="service-detail-page w-full min-h-screen bg-[#F4F1E3] relative flex flex-col items-center font-sans text-[#181122] overflow-x-hidden">
        {/* Decorative pattern */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(171,122,87,0.06),transparent_70%)] rounded-full -z-10 pointer-events-none animate-pulse"></div>

        {/* Banner / Header Image Container */}
        <div className="service-detail-hero-art w-full h-[clamp(200px,35vh,400px)] relative overflow-hidden flex items-center justify-center">
          <img 
            src={numerologyImg} 
            alt="Vedic Numerology" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1E3] via-[#F4F1E3]/10 to-[#181122]/40" />
          
          {/* Back Link Overlay */}
          <button 
            onClick={() => navigate('/services')}
            className="absolute top-6 left-6 md:left-12 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181122] hover:bg-[#D3AF54] text-white hover:text-[#181122] transition-colors shadow-md text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Services</span>
          </button>
        </div>

        {/* Section 1: Vedic Numerology Card (bg-[#F4F1E3], floats over banner using -mt-16) */}
        <div className="service-detail-intro-shell w-full flex flex-col items-center px-6 relative z-10 -mt-16 sm:-mt-24 pb-12">
          <div className="w-full max-w-5xl">
            <motion.div 
              variants={itemVariants} 
              initial="hidden"
              animate="show"
              className="service-detail-intro-card bg-[#181122] border border-[#AB7A57]/20 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 relative overflow-hidden text-white"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D3AF54]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-1 text-left">
                <h1 className="text-sm sm:text-base tracking-[0.3em] font-bold text-[#D3AF54] uppercase font-sans block">
                  ✦ GENERAL NUMEROLOGY ✦
                </h1>
                <p className="text-xs sm:text-sm text-[#D8CFEB] leading-relaxed font-sans font-medium text-left">
                  Unlock the hidden meanings in numbers. Discover how the vibrations of numbers influence your personality, destiny, and life path.
                </p>
                <p className="text-[#D3AF54] font-semibold text-base">{details.price}</p>
              </div>

              <div className="pt-1 text-left">
                <Link 
                  to={`/booking?service=${serviceId}`}
                  className="inline-flex items-center gap-2 bg-[#D3AF54] hover:bg-[#D3AF54]/95 text-[#181122] font-bold px-6 py-2.5 rounded-xl shadow-md transition-all duration-300 text-xs uppercase tracking-wider"
                >
                  <Calendar size={14} />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section 2: The Power of Numbers Section (bg-white with border-y) */}
        <div className="w-full bg-white border-y border-[#AB7A57]/10 py-16 flex flex-col items-center px-6 relative z-10">
          <div className="w-full max-w-5xl">
            <motion.div 
              variants={itemVariants} 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center text-left"
            >
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#181122]">
                  The Power of Numbers
                </h3>
                <p className="text-xs sm:text-sm text-[#181122]/90 leading-relaxed font-sans">
                  Numerology is an ancient science that studies the mystical relationship between numbers and life events. Every number carries a specific vibration that influences various aspects of our existence.
                </p>
                <p className="text-xs sm:text-sm text-[#181122]/80 leading-relaxed font-sans">
                  In Vedic numerology, numbers 1-9 are associated with the nine planets, each carrying unique energies and characteristics. Your birth date and name convert into numbers that reveal insights about your personality, strengths, challenges, and destiny.
                </p>
              </div>
              
              <div className="bg-[#FFFDEE] border-2 border-[#D3AF54]/30 rounded-2xl p-5 sm:p-6 space-y-3 relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D3AF54]/5 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#AB7A57] uppercase block font-sans">
                  ✦ EXPERT CONSULTATION ✦
                </span>
                <p className="text-xs sm:text-sm text-[#181122] font-sans leading-relaxed">
                  <strong>Astrologer Kundan Singh</strong> provides comprehensive numerology consultations, including life path analysis, name corrections, and lucky number identification to help you align with positive vibrations.
                </p>
                <div className="flex items-center gap-1.5 text-[#D3AF54] pt-1">
                  <Star size={12} className="fill-[#D3AF54]" />
                  <Star size={12} className="fill-[#D3AF54]" />
                  <Star size={12} className="fill-[#D3AF54]" />
                  <Star size={12} className="fill-[#D3AF54]" />
                  <Star size={12} className="fill-[#D3AF54]" />
                  <span className="text-xs sm:text-sm text-[#AB7A57] font-bold font-sans ml-1">Trusted Expert</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <ServiceBookingStrip serviceId="numerology" title="Explore what your numbers may reveal" />

        {/* Section 3: Planetary Associations Strip (bg-[#EDE9D7]) */}
        <div className="w-full bg-[#EDE9D7] py-16 flex flex-col items-center px-6 relative z-10">
          <div className="w-full max-w-5xl">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-4 text-center animate-none"
            >
              <h3 className="text-center text-sm font-bold tracking-[0.25em] text-[#D3AF54] uppercase">
                ✦ Planetary Associations ✦
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
                {[
                  { n: '1', p: 'Sun' },
                  { n: '2', p: 'Moon' },
                  { n: '3', p: 'Jupiter' },
                  { n: '4', p: 'Rahu' },
                  { n: '5', p: 'Mercury' },
                  { n: '6', p: 'Venus' },
                  { n: '7', p: 'Ketu' },
                  { n: '8', p: 'Saturn' },
                  { n: '9', p: 'Mars' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#181122] text-white border border-[#D3AF54]/25 rounded-2xl p-3 flex flex-col items-center justify-center shadow-md hover:border-[#D3AF54] transition-all duration-300">
                    <span className="text-xl sm:text-2xl font-bold font-serif text-[#D3AF54]">{item.n}</span>
                    <span className="text-xs sm:text-sm font-sans font-bold tracking-wide text-white/90 mt-1">{item.p}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section 4: Understanding Each Number (bg-white with border-y) */}
        <div className="w-full bg-white border-y border-[#AB7A57]/10 py-16 flex flex-col items-center px-6 relative z-10">
          <div className="w-full max-w-5xl">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6 text-left"
            >
              <div className="text-center md:text-left space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#181122]">
                  Understanding Each Number
                </h3>
                <p className="text-sm sm:text-base text-[#181122] font-semibold font-sans">
                  Each number from 1 to 9 carries unique vibrations and meanings (Tap cards on mobile or hover on desktop to flip)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    num: '1',
                    name: 'Number 1',
                    planet: 'Sun',
                    icon: sunIcon,
                    desc: 'Natural leaders with strong willpower and determination. Creative and innovative.',
                    tags: 'Leadership, independence, ambition'
                  },
                  {
                    num: '2',
                    name: 'Number 2',
                    planet: 'Moon',
                    icon: moonIcon,
                    desc: 'Peacemakers who value harmony and partnerships. Intuitive and empathetic.',
                    tags: 'Cooperation, sensitivity, diplomacy'
                  },
                  {
                    num: '3',
                    name: 'Number 3',
                    planet: 'Jupiter',
                    icon: jupiterIcon,
                    desc: 'Creative communicators with charm and enthusiasm. Artistic and social.',
                    tags: 'Creativity, expression, optimism'
                  },
                  {
                    num: '4',
                    name: 'Number 4',
                    planet: 'Rahu',
                    icon: rahuIcon,
                    desc: 'Builders and organizers who value structure. Reliable and disciplined.',
                    tags: 'Stability, hard work, practicality'
                  },
                  {
                    num: '5',
                    name: 'Number 5',
                    planet: 'Mercury',
                    icon: mercuryIcon,
                    desc: 'Dynamic individuals who love change and variety. Curious and adaptable.',
                    tags: 'Freedom, versatility, adventure'
                  },
                  {
                    num: '6',
                    name: 'Number 6',
                    planet: 'Venus',
                    icon: venusIcon,
                    desc: 'Nurturing souls focused on family and beauty. Caring and artistic.',
                    tags: 'Love, harmony, responsibility'
                  },
                  {
                    num: '7',
                    name: 'Number 7',
                    planet: 'Ketu',
                    icon: ketuIcon,
                    desc: 'Deep thinkers and seekers of truth. Analytical and mysterious.',
                    tags: 'Spirituality, wisdom, introspection'
                  },
                  {
                    num: '8',
                    name: 'Number 8',
                    planet: 'Saturn',
                    icon: saturnIcon,
                    desc: 'Business-minded individuals with strong ambition. Karmic lessons in focus.',
                    tags: 'Power, success, material wealth'
                  },
                  {
                    num: '9',
                    name: 'Number 9',
                    planet: 'Mars',
                    icon: marsIcon,
                    desc: 'Old souls with universal love. Selfless and spiritually advanced.',
                    tags: 'Compassion, completion, humanitarianism'
                  }
                ].map((item, idx) => {
                  const isFlipped = !!flippedCards[idx];
                  return (
                    <div 
                      key={idx} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(idx);
                      }}
                      className="group relative w-full h-48 [perspective:1000px] cursor-pointer"
                    >
                      <div 
                        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
                          isFlipped ? '[transform:rotateY(180deg)]' : ''
                        } lg:group-hover:[transform:rotateY(180deg)]`}
                      >
                        {/* FRONT SIDE */}
                        <div className="absolute inset-0 w-full h-full rounded-3xl bg-[#181122] border border-[#D3AF54]/30 flex flex-col items-center justify-between p-3.5 [backface-visibility:hidden] text-white overflow-hidden shadow-lg">
                          <div className="w-full flex justify-between items-center text-white/40 text-[9px] font-sans font-bold uppercase tracking-wider">
                            <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-[#D3AF54]/60">Vedic Planet</span>
                            <div className="text-[10px] font-serif font-bold text-[#D3AF54] border border-[#D3AF54]/25 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              No. {item.num}
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center -translate-y-1">
                            <img 
                              src={item.icon} 
                              alt={item.planet} 
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full shadow-md transition-transform duration-500 group-hover:scale-110" 
                            />
                          </div>
                          <div className="w-full text-center flex flex-col items-center gap-0.5">
                            <span className="font-serif text-xs sm:text-sm font-bold text-white tracking-wide">{item.planet}</span>
                            <span className="text-[8px] font-semibold text-[#D3AF54]/85 uppercase tracking-widest animate-pulse lg:hidden">Tap to Reveal</span>
                          </div>
                        </div>

                        {/* BACK SIDE */}
                        <div className="absolute inset-0 w-full h-full rounded-3xl bg-[#FFFDEE] border-2 border-[#D3AF54]/40 flex flex-col justify-between p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] text-[#181122] shadow-lg">
                          <div className="space-y-1.5 text-left">
                            <div className="flex justify-between items-center border-b border-[#AB7A57]/20 pb-1">
                              <span className="font-serif font-bold text-xs sm:text-sm text-[#181122]">{item.name}</span>
                              <div className="flex items-center gap-1.5 bg-[#181122] text-[#D3AF54] border border-[#D3AF54]/25 px-2 py-0.5 rounded-full">
                                <img src={item.icon} alt={item.planet} className="w-3 h-3 object-cover rounded-full" />
                                <span className="text-[8px] font-bold uppercase tracking-wider">{item.planet}</span>
                              </div>
                            </div>
                            <p className="text-[10px] sm:text-xs text-[#181122]/95 leading-relaxed font-sans font-semibold">
                              {item.desc}
                            </p>
                          </div>
                          <div className="border-t border-[#AB7A57]/15 pt-1.5 text-left">
                            <span className="text-[10px] sm:text-xs font-sans font-bold text-[#AB7A57] uppercase tracking-wide block">
                              ✦ {item.tags}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section 5: Numerology Services Section (bg-[#EDE9D7]) */}
        <div className="w-full bg-[#EDE9D7] py-8 md:py-16 flex flex-col items-center px-6 relative z-10 pb-8 md:pb-20">
          <div className="w-full max-w-5xl space-y-6 md:space-y-10 text-left">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6"
            >
              <div className="text-center md:text-left space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#181122]">
                  Numerology Services
                </h3>
                <p className="text-xs sm:text-sm text-[#181122]/70 font-sans">
                  Align your celestial numbers to maximize success, growth, and destiny
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {[
                  {
                    title: 'Life Path Number',
                    desc: 'Derived from your birth date, reveals your life purpose and the path you\'re meant to walk.'
                  },
                  {
                    title: 'Destiny Number',
                    desc: 'Calculated from your full name, shows your life\'s goals and what you\'re destined to achieve.'
                  },
                  {
                    title: 'Name Numerology',
                    desc: 'Analysis and correction of names to align with favorable vibrations for success.'
                  },
                  {
                    title: 'Business Name Analysis',
                    desc: 'Select or modify business names for better luck, growth, and prosperity.'
                  },
                  {
                    title: 'Mobile Number Selection',
                    desc: 'Choose lucky mobile numbers that resonate with your personal vibrations.'
                  },
                  {
                    title: 'Lucky Numbers',
                    desc: 'Identify your lucky numbers for important dates, decisions, and opportunities.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#FFF9E6] border border-[#D3AF54]/40 shadow-xs hover:scale-[1.01] hover:border-[#D3AF54] transition-all duration-300 flex flex-col gap-2">
                    <h4 className="font-serif font-bold text-[#181122] text-sm sm:text-base flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D3AF54]" />
                      <span>{item.title}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-[#181122]/90 leading-relaxed font-sans font-medium text-left">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <ServiceBookingStrip serviceId="numerology" title="Ready for your numerology consultation?" />

            {/* Back to Home CTA Button */}
            <motion.div variants={itemVariants} className="flex justify-center pt-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 hover:text-[#D3AF54] text-xs font-semibold uppercase tracking-wider transition-colors text-[#181122]"
              >
                <ArrowLeft size={12} />
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (serviceId === 'vedic-astrology') {
    return (
      <div className="service-detail-page w-full min-h-screen bg-[#F4F1E3] relative flex flex-col items-center font-sans text-[#181122] overflow-x-hidden">
        {/* Decorative patterns */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(171,122,87,0.06),transparent_70%)] rounded-full -z-10 pointer-events-none animate-pulse"></div>
        
        {/* Banner / Header Image Container (Reduced Height) */}
        <div className="service-detail-hero-art w-full h-[clamp(120px,20vh,250px)] relative overflow-hidden flex items-center justify-center">
          <img 
            src={details.image} 
            alt={details.title} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1E3] via-[#F4F1E3]/10 to-[#181122]/40" />
          
          {/* Back Link Overlay */}
          <button 
            onClick={() => navigate('/services')}
            className="absolute top-6 left-6 md:left-12 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181122] hover:bg-[#D3AF54] text-white hover:text-[#181122] transition-colors shadow-md text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Services</span>
          </button>
        </div>

        {/* Section 1: Intro Card (bg-[#F4F1E3], floats over banner using -mt-10) */}
        <div className="service-detail-intro-shell w-full flex flex-col items-center px-6 relative z-10 -mt-10 sm:-mt-16 pb-12">
          <div className="w-full max-w-5xl">
            <motion.div 
              variants={itemVariants} 
              initial="hidden"
              animate="show"
              className="service-detail-intro-card bg-[#FFFDEE] border border-[#AB7A57]/20 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 relative overflow-hidden text-[#181122]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D3AF54]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-1.5 text-left">
                <span className="text-xs sm:text-sm tracking-[0.25em] font-bold text-[#AB7A57] uppercase font-sans block">
                  ✦ CELESTIAL ALIGNMENT ✦
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#181122] tracking-wide">
                  Vedic Astrology (Janam Kundli)
                </h1>
              </div>

              <div className="pt-1 text-left">
                <Link 
                  to={`/booking?service=${serviceId}`}
                  className="inline-flex items-center gap-2 bg-[#D3AF54] hover:bg-[#D3AF54]/95 text-[#181122] font-bold px-6 py-2.5 rounded-xl shadow-md transition-all duration-300 text-xs uppercase tracking-wider"
                >
                  <Calendar size={14} />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section 2: What is Janam Kundli & Benefits Layout (bg-white with border-y) */}
        <div className="w-full bg-white border-y border-[#AB7A57]/10 py-16 flex flex-col items-center px-6 relative z-10">
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
              {/* What is Janam Kundli? */}
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="lg:col-span-4 bg-[#ECCF86] border border-[#AB7A57]/20 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between text-left"
              >
                <div className="space-y-3 text-left">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#181122]">
                    What is Janam Kundli?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#181122] leading-relaxed font-sans font-semibold">
                    A Janam Kundli (Birth Chart) is an astronomical snapshot of the cosmos at the exact second you took your first breath. It maps the celestial positions of the Sun, Moon, and planets relative to your birth location.
                  </p>
                  <p className="text-xs sm:text-sm text-[#181122]/90 leading-relaxed font-sans font-medium">
                    Through classical Vedic formulas, this chart acts as a cosmic blueprint of your life—revealing your innate patterns, planetary blockages, and the structural paths of your destiny.
                  </p>
                </div>

                <div className="pt-4 mt-auto text-left">
                  <Link 
                    to={`/booking?service=${serviceId}`}
                    className="inline-flex items-center gap-2 bg-[#181122] hover:bg-[#181122]/90 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all duration-300 text-xs uppercase tracking-wider"
                  >
                    <Calendar size={13} style={{ color: '#ECCF86' }} />
                    <span>Book Appointment</span>
                  </Link>
                </div>
              </motion.div>

              {/* Why Get a Vedic Reading? */}
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="lg:col-span-8 bg-[#ECCF86] border border-[#AB7A57]/20 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-[#181122] flex flex-col justify-between text-left"
              >
                <div className="space-y-1.5 text-left">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#181122]">
                    Why Get a Vedic Reading?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#181122]/90 font-sans font-medium">
                    Select a category to explore how cosmic alignment directly shifts your pathways:
                  </p>
                </div>

                {/* 3 Rows x 2 Columns Interactive Points Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {[
                    { label: 'Natural Talents & Strengths', sub: 'Discover hidden gifts' },
                    { label: 'Karmic Roadblocks & Obstacles', sub: 'Map your Saturn tests' },
                    { label: 'Career Alignment', sub: 'Maximize business growth' },
                    { label: 'Timeline & Dasha Cycles', sub: 'Decide optimal timings' },
                    { label: 'Relationship Compatibility', sub: 'Build marital harmony' },
                    { label: 'Remedial Shielding', sub: 'Neutralize heavy transits' }
                  ].map((benefit, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveAstrologyBenefit(idx)}
                      className={`p-3 px-4 rounded-xl text-left border transition-all duration-300 flex items-center justify-between cursor-pointer group ${
                        activeAstrologyBenefit === idx
                          ? 'bg-[#181122] text-white border-transparent shadow-md scale-[1.01]'
                          : 'bg-white/85 hover:bg-white text-[#181122] border-[#AB7A57]/20'
                      }`}
                    >
                      <div className="space-y-0.5 text-left flex-grow">
                        <p className={`text-xs sm:text-sm font-bold font-sans ${activeAstrologyBenefit === idx ? 'text-[#D3AF54]' : 'text-[#181122]'}`}>
                          {benefit.label}
                        </p>
                        <p className={`text-[11px] sm:text-xs ${activeAstrologyBenefit === idx ? 'text-[#D8CFEB]' : 'text-[#181122]/80'}`}>
                          {benefit.sub}
                        </p>
                      </div>
                      <ArrowRight size={14} className={`shrink-0 transition-transform ${
                        activeAstrologyBenefit === idx ? 'text-[#D3AF54] translate-x-0.5' : 'text-[#AB7A57] opacity-60'
                      }`} />
                    </button>
                  ))}
                </div>

                {/* Purple/Dark Highlight Box Positioned BELOW the Points Grid */}
                <div className="w-full bg-[#181122] text-white rounded-2xl p-5 sm:p-6 flex flex-col justify-start border border-[#AB7A57]/20 relative overflow-hidden shadow-inner min-h-[105px] text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#D3AF54]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  {[
                    {
                      title: 'Natural Talents & Strengths',
                      desc: 'Discover your intrinsic gifts and primary elements, guiding you toward fields where you flow naturally rather than fighting upstream.'
                    },
                    {
                      title: 'Karmic Roadblocks & Obstacles',
                      desc: 'Identify Saturnian tests, karmic blockages, and difficult planetary placements to know exactly where you must build discipline and caution.'
                    },
                    {
                      title: 'Career Alignment',
                      desc: 'Pinpoint business growth prospects, potential corporate roles, wealth-generation timing, and auspicious dates for career moves.'
                    },
                    {
                      title: 'Timeline & Dasha Cycles',
                      desc: 'Map out the active Vimshottari Dasha cycles to analyze the energetic theme of your current years, deciding optimal windows for major steps.'
                    },
                    {
                      title: 'Relationship Compatibility',
                      desc: 'Verify chart harmonies, marital timelines, partnership dynamics, and energetic sync profiles to foster long-term marital bliss.'
                    },
                    {
                      title: 'Remedial Shielding',
                      desc: 'Pinpoint heavy transits and activate protective shielding using traditional Vedic remedies, gemstones, fasting, and mantra vibrations.'
                    }
                  ].map((item, idx) => (
                    activeAstrologyBenefit === idx && (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-1.5 text-left"
                      >
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#D3AF54]">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-[#D8CFEB] leading-relaxed font-sans font-medium">{item.desc}</p>
                      </motion.div>
                    )
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <ServiceBookingStrip serviceId="vedic-astrology" title="Discuss your birth chart personally" />

        {/* Section 3: Core Life Pathways Explored (bg-[#EDE9D7]) */}
        <div className="w-full bg-[#EDE9D7] py-8 md:py-16 flex flex-col items-center px-6 relative z-10 pb-8 md:pb-20">
          <div className="w-full max-w-5xl space-y-6 md:space-y-10 text-left">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6"
            >
              <div className="text-center md:text-left space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-gold-aura">
                  Core Life Pathways Explored
                </h3>
                <p className="text-xs sm:text-sm text-[#181122]/70 font-sans font-medium">
                  Guidance for navigating key decisions and milestones
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Career & Financial Growth',
                    tip: 'Discover the most suitable industries, wealth generation windows, business partnerships, and timing for career shifts.',
                    icon: Briefcase,
                    direction: 'Karma'
                  },
                  {
                    title: 'Marriage & Relationship',
                    tip: 'Understand compatibility profiles, marital timelines, partnership dynamics, and energetic matches for relationship harmony.',
                    icon: Home,
                    direction: 'Vivaha'
                  },
                  {
                    title: 'Remedial Shielding',
                    tip: 'Identify planetary blocks in your chart and apply structured, traditional remedies like gemstone, mantra, or fasting suggestions.',
                    icon: Shield,
                    direction: 'Upaya'
                  }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-2xl bg-[#ECCF86] border border-[#AB7A57]/55 hover:border-gold-aura hover:bg-[#ECCF86]/95 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex items-start gap-4 cursor-pointer group text-left text-[#181122] shadow-md"
                  >
                    {/* Badge */}
                    <div className="w-12 h-12 rounded-xl border border-gold-aura/40 bg-[#FFFDEE] flex flex-col items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-all duration-300 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-[#AB7A57] font-bold leading-none">Focus</span>
                      <span className="text-[11px] font-serif font-black text-gold-aura leading-none mt-0.5">{item.direction}</span>
                    </div>

                    {/* Text Details */}
                    <div className="space-y-1.5 text-left flex-grow">
                      <div className="flex items-center gap-2">
                        <item.icon size={15} className="text-[#181122] shrink-0" />
                        <h4 className="font-serif font-bold text-[#181122] text-sm sm:text-base leading-tight">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-[#181122]/90 leading-relaxed font-sans font-medium text-left">
                        {item.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <ServiceBookingStrip serviceId="vedic-astrology" title="Ready for your Vedic astrology consultation?" />

            {/* Back to Home CTA Button */}
            <motion.div variants={itemVariants} className="flex justify-center pt-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 hover:text-[#D3AF54] text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <ArrowLeft size={12} />
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
  if (serviceId === 'laal-kitaab') {
    return (
      <div className="service-detail-page w-full min-h-screen bg-[#F4F1E3] relative flex flex-col items-center font-sans text-[#181122] overflow-x-hidden">
        {/* Ambient energy */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(211,175,84,0.06),transparent_70%)] rounded-full -z-10 pointer-events-none animate-pulse"></div>

        {/* Banner / Header Image Container */}
        <div className="service-detail-hero-art w-full h-[clamp(200px,35vh,400px)] relative overflow-hidden flex items-center justify-center">
          <img 
            src={details.image} 
            alt={details.title} 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1E3] via-[#F4F1E3]/10 to-[#181122]/40" />
          
          {/* Back Link Overlay */}
          <button 
            onClick={() => navigate('/services')}
            className="absolute top-6 left-6 md:left-12 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181122] hover:bg-[#D3AF54] text-white hover:text-[#181122] transition-colors shadow-md text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Services</span>
          </button>
        </div>

        {/* Section 1: Tab switcher header area (bg-[#F4F1E3]) */}
        <div className="service-detail-intro-shell w-full flex flex-col items-center px-6 relative z-10 -mt-16 sm:-mt-24 pb-12">
          <div className="w-full max-w-5xl space-y-6">
            {/* Lal Kitaab Remedies title card */}
            <motion.div 
              variants={itemVariants} 
              initial="hidden"
              animate="show"
              className="service-detail-intro-card bg-[#181122] border border-[#AB7A57]/20 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 relative overflow-hidden text-white"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D3AF54]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-1 text-left">
                <h1 className="text-sm sm:text-base tracking-[0.3em] font-bold text-[#D3AF54] uppercase font-sans block text-left">
                  ✦ LAL KITAAB REMEDIES ✦
                </h1>
                <p className="text-xs sm:text-sm text-[#D8CFEB] leading-relaxed font-sans font-medium text-left">
                  Simple, non-expensive, and highly practical daily solutions to balance ancestral debts (Rinas) and planetary blockages.
                </p>
              </div>
              <div className="pt-1 text-left">
                <Link to="/booking?service=laal-kitaab" className="inline-flex items-center gap-2 bg-[#D3AF54] hover:bg-[#D3AF54]/95 text-[#181122] font-bold px-6 py-2.5 rounded-xl shadow-md transition-all duration-300 text-xs uppercase tracking-wider">
                  <Calendar size={14} /><span>Book Appointment</span>
                </Link>
              </div>
            </motion.div>

            {/* Interactive Navigation Tab Bar */}
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="show"
              className="border-b border-[#AB7A57]/20 pb-0.5 flex justify-start sm:justify-center overflow-x-auto w-full scrollbar-none"
            >
              <div className="flex gap-4 md:gap-8 min-w-max px-1">
                {[
                  { label: 'Overview & Philosophy', icon: <BookOpen size={14} /> },
                  { label: 'Key Diagnostic Areas', icon: <Compass size={14} /> },
                  { label: 'Practical Remedies', icon: <Heart size={14} /> }
                ].map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveLalKitaabTab(idx)}
                    className={`py-3 px-1.5 font-sans text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 border-b-2 flex items-center gap-2 cursor-pointer ${
                      activeLalKitaabTab === idx
                        ? 'border-[#D3AF54] text-[#D3AF54] scale-105'
                        : 'border-transparent text-[#181122]/60 hover:text-[#181122]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <ServiceBookingStrip serviceId="laal-kitaab" title="Discuss practical remedies for your chart" />

        {/* Section 2: Tab Content (bg-white with border-y) */}
        <div className="w-full bg-white border-y border-[#AB7A57]/10 py-16 flex flex-col items-center px-6 relative z-10">
          <div className="w-full max-w-5xl">
            <motion.div
              key={activeLalKitaabTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full text-left"
            >
              {activeLalKitaabTab === 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  {/* What is Lal Kitaab? (Left Page) */}
                  <div className="bg-[#ECCF86] border border-[#AB7A57]/20 rounded-3xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 relative flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#181122] flex items-center gap-2">
                        <span>What is Lal Kitaab?</span>
                        <span className="text-[#D3AF54] text-xs">✦</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#181122] leading-relaxed font-sans font-semibold">
                        Lal Kitaab (literally "Red Book") is a highly revered, legendary branch of Vedic astrology. It is globally famous for its incredibly simple, practical, and highly direct remedial measures (Upayas) that require no expensive sacrifices, pujas, or gemstone investments.
                      </p>
                      <p className="text-xs sm:text-sm text-[#181122]/95 leading-relaxed font-sans font-medium">
                        It operates on a symptom-based diagnostic method, converting complex cosmic calculations into intuitive daily exercises—such as offering grains to birds, feeding cows, or keeping specific natural metals inside your home.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#AB7A57]/20 mt-3 flex items-center gap-2 text-xs font-serif font-bold text-[#181122]/90 italic">
                      <span>✦ Directly balances ancestral planetary debts (Rinas)</span>
                    </div>
                  </div>

                  {/* Why Choose Lal Kitaab Remedies? (Right Page) */}
                  <div className="bg-[#ECCF86] border border-[#AB7A57]/20 rounded-3xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 relative flex flex-col justify-between text-left">
                    <div className="space-y-3">
                      <div className="space-y-1 text-left">
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-[#181122] flex items-center gap-2">
                          <span>Why Choose Lal Kitaab?</span>
                          <span className="text-[#D3AF54] text-xs">✦</span>
                        </h3>
                        <p className="text-xs text-[#181122]/85 font-sans font-semibold">
                          Neutralize negative transits and ease karmic weights with ease:
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                        {[
                          'Household task-based actions',
                          'Remedies ancestral debts',
                          'Symptom-based diagnostic method',
                          'No complex charts calculations',
                          'Extremely direct & immediate results',
                          'Balances home energetic flow'
                        ].map((benefit, idx) => (
                          <div key={idx} className="p-2 rounded-lg bg-white border border-[#AB7A57]/15 flex items-start gap-2 shadow-2xs hover:scale-[1.01] transition-transform duration-300">
                            <div className="w-4 h-4 rounded-full bg-[#FFFDEE] border border-[#D3AF54]/50 flex items-center justify-center shrink-0 mt-0.5 text-gold-aura font-bold text-[9px]">
                              ✓
                            </div>
                            <span className="text-[11px] sm:text-xs text-[#181122] font-semibold font-sans leading-tight text-left">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-[#AB7A57]/20 mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-sans font-bold text-[#181122]/70 uppercase tracking-wider">Ready for a reading?</span>
                      <Link 
                        to={`/booking?service=${serviceId}`}
                        className="inline-flex items-center gap-1.5 bg-[#181122] hover:bg-[#181122]/90 text-white font-bold px-3.5 py-1.5 rounded-lg shadow-md transition-all duration-300 text-[9px] uppercase tracking-wider cursor-pointer"
                      >
                        <Calendar size={10} style={{ color: '#ECCF86' }} />
                        <span>Book Appointment</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeLalKitaabTab === 1 && (
                <div className="space-y-6">
                  <div className="text-center md:text-left space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#181122]">
                      Key Diagnostic Areas
                    </h3>
                    <p className="text-xs sm:text-sm text-[#181122]/70 font-sans font-medium">
                      Lal Kitaab isolates and addresses specific planetary blockages (Rinas):
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {[
                      { title: 'Pitru Rina', desc: 'Ancestral debt indicators that manifest as sudden obstacles in career growth, progeny issues, or mental restlessness.' },
                      { title: 'Dharma Rina', desc: 'Religious debts resulting from breaking spiritual commitments, resolved through temples and public charity.' },
                      { title: 'Deva Rina', desc: 'Planetary debts causing sudden health troubles or structural blockages in properties and houses.' },
                      { title: 'Matru Rina', desc: 'Maternal debt indicating emotional instability, obstacles in savings, and domestic disputes.' }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.03, y: -6 }}
                        className="bg-[#ECCF86] border border-[#AB7A57]/20 rounded-2xl p-6 flex flex-col items-start text-left gap-4 transition-all duration-300 shadow-md hover:shadow-xl group cursor-pointer text-[#181122]"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-10 h-10 rounded-full border border-[#D3AF54]/40 bg-[#181122] text-[#ECCF86] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(24,17,34,0.3)] transition-all duration-300 font-serif font-bold text-xs sm:text-sm">
                            {idx + 1}
                          </div>
                          <span className="font-serif text-[#181122] group-hover:text-gold-aura font-bold text-xs md:text-sm uppercase tracking-wider transition-colors duration-300">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[13px] md:text-sm text-[#181122]/90 leading-relaxed font-sans w-full font-semibold text-left">
                          {item.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeLalKitaabTab === 2 && (
                <div className="space-y-6">
                  <div className="text-center md:text-left space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#181122]">
                      Core Remedy Areas Explored
                    </h3>
                    <p className="text-xs sm:text-sm text-[#181122]/70 font-sans font-medium">
                      Standard, practical remedies suggested in consultations
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Animal & Bird Service',
                        tip: 'Feeding black dogs for Rahu/Ketu balance, green fodder to cows for Venus, or bird grains for Mercury to open financial gates.',
                        icon: Heart,
                        direction: 'Seva'
                      },
                      {
                        title: 'Water Flowing Upaya',
                        tip: 'Floating organic materials, coconut, or copper coins in active running streams to neutralize severe transit blockages.',
                        icon: RefreshCw,
                        direction: 'Flow'
                      },
                      {
                        title: 'Metal & Sand Placements',
                        tip: 'Placing square copper pieces, solid silver balls, or river sand in specific cupboards to clear negative energies.',
                        icon: Shield,
                        direction: 'Placement'
                      }
                    ].map((item, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="p-5 rounded-2xl bg-[#ECCF86] border border-[#AB7A57]/20 hover:border-[#D3AF54]/70 hover:shadow-xl transition-all duration-300 flex items-start gap-4 cursor-pointer group text-left shadow-md"
                      >
                        <div className="w-12 h-12 rounded-xl border border-[#D3AF54]/40 bg-[#181122] flex flex-col items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-all duration-300 text-center">
                          <span className="text-[8px] uppercase tracking-wider text-[#ECCF86] font-bold leading-none">Focus</span>
                          <span className="text-[10px] font-serif font-black text-white leading-none mt-0.5">{item.direction}</span>
                        </div>

                        <div className="space-y-1.5 text-left flex-grow">
                          <div className="flex items-center gap-2">
                            <item.icon size={15} className="text-[#181122] shrink-0" />
                            <h4 className="font-serif font-bold text-[#181122] text-sm sm:text-base leading-tight">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-xs sm:text-sm text-[#181122]/95 leading-relaxed font-sans font-medium text-left">
                            {item.tip}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <ServiceBookingStrip serviceId="laal-kitaab" title="Ready for a Laal Kitaab consultation?" />

        {/* Section 3: Back to Home (bg-[#EDE9D7]) */}
        <div className="w-full bg-[#EDE9D7] py-8 md:py-12 flex flex-col items-center px-6 relative z-10 pb-8 md:pb-20">
          <div className="w-full max-w-5xl">
            <motion.div variants={itemVariants} className="flex justify-center">
              <Link 
                to="/" 
                className="flex items-center gap-2 hover:text-[#D3AF54] text-xs font-semibold uppercase tracking-wider transition-colors text-[#181122]"
              >
                <ArrowLeft size={12} />
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (serviceId === 'vastu') {
    return (
      <div className="service-detail-page w-full min-h-screen bg-[#F4F1E3] relative flex flex-col items-center font-sans text-[#181122] overflow-x-hidden">
        {/* Decorative patterns */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(171,122,87,0.06),transparent_70%)] rounded-full -z-10 pointer-events-none animate-pulse"></div>
        
        {/* Banner / Header Image Container */}
        <div className="service-detail-hero-art w-full h-[clamp(200px,35vh,400px)] relative overflow-hidden flex items-center justify-center">
          <img 
            src={details.image} 
            alt={details.title} 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F1E3] via-[#F4F1E3]/10 to-[#181122]/40" />
          
          {/* Back Link Overlay */}
          <button 
            onClick={() => navigate('/services')}
            className="absolute top-6 left-6 md:left-12 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181122] hover:bg-[#D3AF54] text-white hover:text-[#181122] transition-colors shadow-md text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Services</span>
          </button>
        </div>

        {/* Section 1: Intro Card (bg-[#F4F1E3], floats over banner using -mt-16) */}
        <div className="service-detail-intro-shell w-full flex flex-col items-center px-6 relative z-10 -mt-16 sm:-mt-24 pb-12">
          <div className="w-full max-w-5xl">
            <motion.div 
              variants={itemVariants} 
              initial="hidden"
              animate="show"
              className="service-detail-intro-card bg-[#181122] border border-[#AB7A57]/20 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3 relative overflow-hidden text-white text-left"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#D3AF54]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-1 text-left">
                <h1 className="text-sm sm:text-base tracking-[0.3em] font-bold text-[#D3AF54] uppercase font-sans block text-left">
                  ✦ VASTU CONSULTATION ✦
                </h1>
              </div>

              <div className="pt-1 text-left">
                <Link 
                  to={`/booking?service=${serviceId}`}
                  className="inline-flex items-center gap-2 bg-[#D3AF54] hover:bg-[#D3AF54]/95 text-[#181122] font-bold px-6 py-2.5 rounded-xl shadow-md transition-all duration-300 text-xs uppercase tracking-wider"
                >
                  <Calendar size={14} />
                  <span>Book Appointment</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section 2: What is Vastu & Benefits Layout (bg-white with border-y) */}
        <div className="w-full bg-white border-y border-[#AB7A57]/10 py-16 flex flex-col items-center px-6 relative z-10">
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {/* What is Vastu Shastra? */}
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="bg-white border border-[#AB7A57]/15 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 text-left"
              >
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-left" style={{ color: '#D3AF54' }}>
                  What is Vastu Shastra?
                </h3>
                <p className="text-xs sm:text-sm text-[#181122]/90 leading-relaxed font-sans font-medium text-left">
                  Vastu Shastra is an ancient Indian science that harmonizes architecture with nature's five elements—Earth, Water, Fire, Air, and Space. As the best Vastu consultant in Delhi, we provide guidelines for designing spaces that promote positive energy flow.
                </p>
                <p className="text-xs sm:text-sm text-[#181122]/80 leading-relaxed font-sans font-medium text-left">
                  The fundamental principle of Vastu is that the directions and placement of rooms, furniture, and objects affect the energy of a space, which in turn influences the health, prosperity, and happiness of its occupants.
                </p>
              </motion.div>

              {/* Benefits of Vastu */}
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="bg-[#FFFDEE] border border-gold-aura/30 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between text-left"
              >
                <div className="space-y-1.5 text-left">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-left" style={{ color: '#D3AF54' }}>
                    Benefits of Vastu
                  </h3>
                  <p className="text-xs sm:text-sm text-[#181122]/70 font-sans font-medium text-left">
                    Harmonizing structural energy yields multiple benefits for daily life.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-left">
                  {[
                    'Improved health and well-being',
                    'Enhanced prosperity and wealth',
                    'Better relationships and harmony',
                    'Career growth and success',
                    'Mental peace and positivity',
                    'Protection from negative energies'
                  ].map((benefit, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-gold-aura/20 flex items-start gap-2.5 shadow-2xs hover:scale-[1.02] transition-transform duration-300">
                      <CheckCircle size={16} className="text-gold-aura shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[#181122] font-semibold font-sans leading-tight text-left">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <ServiceBookingStrip serviceId="vastu" title="Bring your space into the conversation" />

        {/* Section 3: The Five Elements Section (bg-[#EDE9D7]) */}
        <div className="w-full bg-[#EDE9D7] py-16 flex flex-col items-center px-6 relative z-10">
          <div className="w-full max-w-5xl">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6 text-left"
            >
              <div className="text-center md:text-left space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-left" style={{ color: '#D3AF54' }}>
                  The Five Elements
                </h3>
                <p className="text-xs sm:text-sm text-[#181122]/70 font-sans font-medium">
                  Vastu is based on the balance of Pancha Mahabhuta (Five Great Elements)
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { name: 'Earth', sanskrit: 'Prithvi', dir: 'SW', icon: earthImg },
                  { name: 'Fire', sanskrit: 'Agni', dir: 'SE', icon: fireImg },
                  { name: 'Air', sanskrit: 'Vayu', dir: 'NW', icon: airImg },
                  { name: 'Water', sanskrit: 'Jal', dir: 'NE', icon: waterImg },
                  { name: 'Space', sanskrit: 'Akash', dir: 'Center', icon: spaceImg }
                ].map((item, idx) => {
                  return (
                    <div 
                      key={idx} 
                      className={`vastu-element-card bg-white border border-[#AB7A57]/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xs hover:scale-[1.02] hover:border-gold-aura transition-all duration-300 col-span-1 md:col-span-2 ${
                        idx === 3 ? 'md:col-start-2' : idx === 4 ? 'col-span-2 md:col-span-2 max-w-[280px] md:max-w-none justify-self-center w-full' : 'w-full'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-full bg-[#FFF9E6] border border-gold-aura/30 flex items-center justify-center mb-3 overflow-hidden p-2 shadow-xs">
                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="font-serif font-bold text-[#181122] text-base sm:text-lg">{item.name}</span>
                      <span className="text-xs sm:text-sm font-sans font-bold text-[#AB7A57] uppercase tracking-wide mt-0.5">{item.sanskrit}</span>
                      <div className="mt-3 px-3 py-0.5 bg-[#181122] text-gold-aura rounded-full border border-gold-aura/25 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                        Direction: {item.dir}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Section 4: Essential Vastu Tips & Back button (bg-white with border-t) */}
        <div className="w-full bg-white border-t border-[#AB7A57]/10 py-8 md:py-16 flex flex-col items-center px-6 relative z-10 pb-8 md:pb-20">
          <div className="w-full max-w-5xl space-y-6 md:space-y-10 text-left">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-6 text-left"
            >
              <div className="text-center md:text-left space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-left" style={{ color: '#D3AF54' }}>
                  Essential Vastu Tips
                </h3>
                <p className="text-xs sm:text-sm text-[#181122]/70 font-sans font-medium text-left">
                  Simple guidelines to bring positive energy into your home
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {[
                  {
                    title: 'Main Entrance',
                    tip: 'The main entrance should ideally face North, East, or Northeast for maximum positive energy flow. Avoid South-West entrances.',
                    icon: Home,
                    direction: 'N/NE'
                  },
                  {
                    title: 'Living Room',
                    tip: 'Place the living room in the North or East direction. Ensure good natural light and ventilation for positive vibrations.',
                    icon: Sofa,
                    direction: 'N/E'
                  },
                  {
                    title: 'Master Bedroom',
                    tip: 'The master bedroom should be in the South-West corner. Place the bed so you sleep with your head towards South.',
                    icon: Bed,
                    direction: 'SW'
                  },
                  {
                    title: 'Kitchen',
                    tip: 'The kitchen should be in the South-East corner (Agni corner). The cook should face East while cooking.',
                    icon: Utensils,
                    direction: 'SE'
                  },
                  {
                    title: 'Bathroom',
                    tip: 'Bathrooms should be in the West or North-West direction. Avoid placing them in the North-East corner.',
                    icon: Bath,
                    direction: 'W/NW'
                  },
                  {
                    title: 'Office/Study',
                    tip: 'Home office or study room should be in the West or South-West. Face North or East while working for better concentration.',
                    icon: Briefcase,
                    direction: 'W/SW'
                  }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 rounded-2xl bg-white border border-[#AB7A57]/15 hover:border-[#D3AF54]/70 hover:bg-[#FFFDEE] hover:shadow-xs transition-all duration-300 flex items-start gap-4 cursor-pointer group text-left"
                  >
                    {/* Direction Badge */}
                    <div className="w-12 h-12 rounded-xl border border-gold-aura/40 bg-[#FFFDEE] flex flex-col items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-all duration-300 text-center">
                      <span className="text-[8px] uppercase tracking-wider text-[#AB7A57] font-bold leading-none">Dir</span>
                      <span className="text-[11px] font-serif font-black text-gold-aura leading-none mt-0.5">{item.direction}</span>
                    </div>

                    {/* Text Details */}
                    <div className="space-y-1.5 text-left flex-grow">
                      <div className="flex items-center gap-2">
                        <item.icon size={15} className="text-[#AB7A57] group-hover:text-gold-aura transition-colors shrink-0" />
                        <h4 className="font-serif font-bold text-[#181122] text-sm sm:text-base leading-tight">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-[#181122]/80 leading-relaxed font-sans font-medium text-left">
                        {item.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <ServiceBookingStrip serviceId="vastu" title="Ready for your Vastu consultation?" />

            {/* Back to Home CTA Button */}
            <motion.div variants={itemVariants} className="flex justify-center pt-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 hover:text-[#D3AF54] text-xs font-semibold uppercase tracking-wider transition-colors text-[#181122]"
              >
                <ArrowLeft size={12} />
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }



  if (serviceId === 'prashna-kundali') {
    return (
      <PrashnaKundaliDetail details={details} navigate={navigate} />
    );
  }

  return (
      <div className="service-detail-page w-full min-h-screen bg-[#FDFCF5] relative flex flex-col items-center font-sans text-[#181122] pb-8 md:pb-16 overflow-x-hidden">
      
      {/* Decorative patterns */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(171,122,87,0.06),transparent_70%)] rounded-full -z-10 pointer-events-none animate-pulse"></div>
      
      {/* Banner / Header Image Container */}
      <div className="service-detail-hero-art w-full h-[clamp(200px,35vh,400px)] relative overflow-hidden flex items-center justify-center">
        <img 
          src={details.image} 
          alt={details.title} 
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCF5] via-[#FDFCF5]/10 to-[#181122]/40" />
        
        {/* Back Link Overlay */}
        <button 
          onClick={() => navigate('/services')}
          className="absolute top-6 left-6 md:left-12 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181122] hover:bg-[#D3AF54] text-white hover:text-[#181122] transition-colors shadow-md text-xs font-bold uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Services</span>
        </button>
      </div>

      {/* Main Content Area */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="service-detail-intro-shell w-full max-w-5xl px-6 md:px-12 -mt-16 sm:-mt-24 relative z-10 space-y-6 md:space-y-10 text-left"
      >
        
        {/* Intro Service Card */}
        <motion.div 
          variants={itemVariants} 
          className="service-detail-intro-card bg-[#181122] text-white border border-[#AB7A57]/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#D3AF54]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#D3AF54] uppercase block">
              ✦ CELESTIAL CONSULTATION ✦
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-wide">
              {details.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#D8CFEB] italic font-serif">
              {details.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-y border-white/5 py-4">
            <div className="flex items-center gap-2">
              <Gem size={16} className="text-[#D3AF54]" />
              <span className="text-xs font-bold text-[#D3AF54] bg-white/5 border border-[#D3AF54]/25 px-3 py-1 rounded-full">
                {details.price}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#D8CFEB] leading-relaxed font-sans">
            {details.desc}
          </p>

          <div className="pt-2">
            <Link 
              to={`/booking?service=${serviceId}`}
              className="inline-flex items-center gap-2.5 bg-[#D3AF54] hover:bg-[#D3AF54]/95 text-[#181122] font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-[#D3AF54]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider"
            >
              <Calendar size={16} />
              <span>Book Appointment</span>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Process & Benefits */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step-by-Step Process */}
            <motion.div 
              variants={itemVariants} 
              className="bg-white border border-[#AB7A57]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#181122] flex items-center gap-2">
                <Sparkles size={20} className="text-[#D3AF54]" />
                <span>Consultation Process</span>
              </h3>
              
              <div className="space-y-4">
                {details.process.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#181122] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-[#D3AF54]/50">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-[#181122]/90 leading-relaxed font-sans pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Core Benefits */}
            <motion.div 
              variants={itemVariants} 
              className="bg-white border border-[#AB7A57]/15 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#181122] flex items-center gap-2">
                <Shield size={20} className="text-[#D3AF54]" />
                <span>Core Consultation Benefits</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.benefits.map((benefit, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FFFDEE]/60 border border-[#AB7A57]/10 flex flex-col gap-1.5 text-left">
                    <h4 className="font-serif font-bold text-sm text-[#181122] flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-[#D3AF54] shrink-0" />
                      <span>{benefit.title}</span>
                    </h4>
                    <p className="text-xs text-[#181122]/80 leading-relaxed font-sans">
                      {benefit.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Column: Success Story / Testimonial card */}
          <div className="lg:col-span-4 h-full">
            <motion.div 
              variants={itemVariants} 
              className="bg-[#FFFDEE] border-2 border-[#D3AF54]/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full relative overflow-hidden"
            >
              <span className="absolute top-2 right-4 text-[#D3AF54]/10 text-9xl font-serif select-none pointer-events-none leading-none">“</span>
              
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#AB7A57] uppercase block font-sans">
                  ✦ LIFE TRANSFORMATION ✦
                </span>
                
                <blockquote className="relative z-10">
                  <p className="text-xs sm:text-sm text-[#181122]/90 leading-relaxed font-sans italic">
                    "{details.story.text}"
                  </p>
                </blockquote>
              </div>

              <div className="border-t border-[#AB7A57]/15 pt-4 mt-6">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Star size={12} className="fill-[#D3AF54] text-[#D3AF54]" />
                  <Star size={12} className="fill-[#D3AF54] text-[#D3AF54]" />
                  <Star size={12} className="fill-[#D3AF54] text-[#D3AF54]" />
                  <Star size={12} className="fill-[#D3AF54] text-[#D3AF54]" />
                  <Star size={12} className="fill-[#D3AF54] text-[#D3AF54]" />
                </div>
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#181122]">
                  {details.story.client}
                </h4>
                <span className="text-[10px] font-bold text-[#D3AF54] uppercase tracking-wider block mt-0.5">
                  {details.story.timeline}
                </span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Back Link bottom */}
        <motion.div variants={itemVariants} className="flex justify-center pt-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 hover:text-[#D3AF54] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Back to Home</span>
          </Link>
        </motion.div>

      </motion.div>

    </div>
  )
}



function PrashnaKundaliDetail({ details, navigate }) {
  const flow=useEnquiry('prashna');
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    question: ''
  });
  const submitted=flow.receipt?.state==='received';
  const loading=flow.busy||flow.blocked||flow.waiting>0;
  const [localError,setServerError]=useState("")
  const serverError=localError||flow.error;
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false)
  useEffect(()=>{if(flow.started&&flow.receipt?.state!=='received')setShowOtpModal(true)},[flow.started,flow.receipt?.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validatePrashnaForm = () => {
    if (!formData.name.trim()) {
      return "Please enter your Full Name.";
    }
    if (formData.name.trim().length < 2) {
      return "Name must be at least 2 characters.";
    }
    if (!formData.email.trim()) {
      return "Please enter your Email Address.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      return "Please enter your Mobile Number.";
    }
    const cleanPhone = formData.phone.trim().replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return "Please enter a valid mobile number (e.g. 9876543210).";
    }
    const digits = cleanPhone.replace('+', '');
    if (/^(\d)\1{6,}$/.test(digits)) {
      return "Mobile number cannot consist of only repeating identical digits.";
    }
    if (!formData.location.trim()) {
      return "Please enter your Current Location (City, Country).";
    }
    if (formData.location.trim().length < 2) {
      return "Please enter a valid location.";
    }
    if (!formData.question.trim()) {
      return "Please enter your Specific Question.";
    }
    if (formData.question.trim().length < 10) {
      return "Your question must be at least 10 characters so we can perform an accurate Prashna chart reading.";
    }
    return null;
  };

  useEffect(() => {
    if (attemptedSubmit) {
      const err = validatePrashnaForm();
      setServerError(err || "");
    }
  }, [formData, attemptedSubmit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    
    const validationError = validatePrashnaForm();
    if (validationError) {
      setServerError(validationError);
      const formElement = document.getElementById("prashna-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if(loading)return;
    setShowOtpModal(true);
    await flow.start({source:'prashna',kind:'prashna',service_interest:'prashna-kundali',name:formData.name,
      email:formData.email,phone:formData.phone.trim().startsWith('+')?formData.phone.trim():'+91'+formData.phone.replace(/[\s()-]/g,''),location:formData.location,subject:'Prashna Kundali question',message:formData.question});
  };

  const pillars = [
    {
      title: "No Birth Time Required",
      desc: "Perfect if you don't know your exact date, time, or city of birth.",
      icon: <User size={18} />
    },
    {
      title: "Hyper-Focused Precision",
      desc: "Analyzes the exact energy of one specific question rather than a broad lifetime overview.",
      icon: <Sparkles size={18} />
    },
    {
      title: "Rapid Turnaround",
      desc: "Designed for urgent situations where you cannot wait weeks for a full birth chart reading.",
      icon: <Clock size={18} />
    },
    {
      title: "Event-Based Timing",
      desc: "Pinpoints when a specific event will manifest (e.g., job offer arrival, missing item recovery, or deal closure).",
      icon: <Gem size={18} />
    }
  ];

  const categories = [
    {
      title: "Career & Business",
      logo: solutionsLogo,
      queries: [
        "\"Will I get the job offer this week?\"",
        "\"Is this business partnership safe to sign?\""
      ]
    },
    {
      title: "Relationships & Intentions",
      logo: guidanceLogo,
      queries: [
        "\"Is my partner being genuine?\"",
        "\"Will my ex reconnect with me?\""
      ]
    },
    {
      title: "Property & Finance",
      logo: accuracyLogo,
      queries: [
        "\"Should I purchase this house right now?\"",
        "\"Will I recover my lost money?\""
      ]
    },
    {
      title: "Travel & Relocation",
      logo: transformationLogo,
      queries: [
        "\"Will my visa approval go through smoothly?\"",
        "\"Is moving abroad favorable right now?\""
      ]
    },
    {
      title: "Missing Items & Diagnostics",
      logo: clockLogo,
      queries: [
        "\"Where is my lost document/item?\"",
        "\"When will my health recover from this phase?\""
      ]
    }
  ];

  return (
    <div className="service-detail-page w-full min-h-screen bg-[#F4F1E3] relative flex flex-col items-center overflow-hidden font-sans">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION (Warm Ivory bg-[#F4F1E3])                  */}
      {/* ========================================================= */}
      <div className="service-detail-prashna-hero w-full py-16 md:py-20 flex flex-col items-center relative z-10 px-6">
        {/* Ambient glowing energy fields */}
        <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-[#D3AF54]/5 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse" />

        {/* Back button link */}
        <div className="w-full max-w-5xl mb-10 text-left">
          <button 
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181122] hover:bg-[#D3AF54] text-white hover:text-[#181122] transition-colors shadow-md text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Services</span>
          </button>
        </div>

        {/* Hero Content */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl text-center flex flex-col items-center space-y-6"
        >
          {/* Rounded Pill Badge with Purple Glow */}
          <div className="px-4 py-1.5 rounded-full text-purple-700 bg-purple-50 border border-purple-500/20 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-[0_0_10px_rgba(124,93,248,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            <span>Instant Clarity • Horary Precision</span>
          </div>

          {/* Main Headline with Gold Gradient text style matching True Destiny */}
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#181122] tracking-wide leading-tight max-w-3xl">
            <span className="text-xl md:text-2xl font-sans font-medium text-slate-500 block mb-2 tracking-normal">
              Instant Answers to Urgent Life Questions:
            </span>
            <span className="text-[#181122]">
              Expert Prashna Kundali Analysis
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl font-sans font-medium">
            When time is critical or birth details are unknown, Prashna Kundali (Horary Astrology) constructs a precise cosmic map for the exact second your question is asked—providing immediate, hyper-focused clarity to help you make confident decisions.
          </p>

          {/* Scroll Button */}
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <p className="w-full text-[#76561d] font-semibold text-base mb-1">{details.price}</p>
            <Link to="/booking?service=prashna-kundali" className="inline-flex items-center gap-2.5 bg-[#181122] hover:bg-[#30263c] text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider">
              <Calendar size={16} /><span>Book Appointment</span>
            </Link>
            <button 
              onClick={() => document.getElementById('questionForm')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2.5 bg-[#F1E4C3] hover:bg-[#EAD18D] text-[#181122] font-bold px-8 py-3.5 rounded-xl border border-[#D3AF54]/30 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-xs sm:text-sm uppercase tracking-wider cursor-pointer font-sans"
            >
              <Calendar size={16} />
              <span>Ask a Question</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* 2. CORE PILLARS SECTION (Pure White bg-white)             */}
      {/* ========================================================= */}
      <div className="w-full bg-white border-y border-[#AB7A57]/10 py-16 md:py-20 flex flex-col items-center relative z-10 px-6">
        
        <div className="w-full max-w-5xl mb-10 text-left">
          <span className="text-[#AB7A57] text-xs font-bold uppercase tracking-widest block mb-2">✦ UNIQUE ADVANTAGES ✦</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#181122]">Horary Astrology Pillars</h2>
        </div>

        {/* Minimalist interactive card grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const isAnyHovered = hoveredIdx !== null;
            return (
              <motion.div 
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                whileHover={{ y: -5 }}
                className={`border rounded-2xl p-5 text-left transition-all duration-300 flex flex-col justify-start gap-2.5 group shadow-xs relative overflow-hidden cursor-pointer ${
                  isHovered 
                    ? 'bg-white border-[#D3AF54] shadow-[0_4px_20px_rgba(211,175,84,0.15)] scale-[1.02]' 
                    : isAnyHovered 
                      ? 'bg-[#F6F3E6]/30 border-[#AB7A57]/10 opacity-50' 
                      : 'bg-[#F6F3E6]/60 border-[#AB7A57]/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-inner transition-all duration-300 ${
                    isHovered 
                      ? 'bg-[#181122] text-white border-[#181122] scale-105' 
                      : 'bg-[#FFFDEE] border-[#D3AF54]/30 text-[#D3AF54]'
                  }`}>
                    {item.icon}
                  </div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#181122] leading-snug">{item.title}</h3>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>

      <ServiceBookingStrip serviceId="prashna-kundali" title="Prefer a booked one-to-one consultation?" />

      {/* ========================================================= */}
      {/* 3. TYPES OF QUESTIONS SECTION (Warm Sand bg-[#EDE9D7])     */}
      {/* ========================================================= */}
      <div className="w-full bg-[#EDE9D7] py-8 md:py-20 flex flex-col items-center relative z-10 px-6">
        
        <div className="w-full max-w-5xl mb-10 text-left">
          <span className="text-[#AB7A57] text-xs font-bold uppercase tracking-widest block mb-2">✦ CHANNELS OF INQUIRY ✦</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#181122]">Types of Questions You Can Ask</h2>
        </div>

        {/* 5-tile responsive grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#AB7A57]/20 rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFFDEE] border border-[#D3AF54]/20 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                    <img src={item.logo} alt={item.title} className="w-5 h-5 object-contain" />
                  </div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#181122] leading-tight">{item.title}</h4>
                </div>
                <div className="space-y-2 mt-2">
                  {item.queries.map((q, qidx) => (
                    <p key={qidx} className="text-xs sm:text-sm text-slate-700 font-sans italic leading-relaxed font-semibold">
                      {q}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. INTERACTIVE CTA FORM SECTION (Pure White bg-white)     */}
      {/* ========================================================= */}
      <div id="questionForm" className="w-full bg-white border-t border-[#AB7A57]/10 py-8 md:py-20 flex flex-col items-center relative z-10 px-6">
        
        <div className="w-full max-w-md mb-8 text-center">
          <span className="text-[#AB7A57] text-xs font-bold uppercase tracking-widest block mb-2">✦ GET INSTANT CLARITY ✦</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#181122]">Submit Your Prashna</h2>
          <p className="text-xs text-slate-500 font-sans mt-2">
            Fill in your details below. Astrologer Kundan Singh will construct your horary chart for the exact second of submission.
          </p>
        </div>

        {/* Themed with Navbar dark color #181122 */}
        <div className="w-full max-w-2xl bg-[#181122] border border-[#AB7A57]/30 rounded-3xl p-6 md:p-8 shadow-xl relative">
          
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 bg-[#241B33] border border-[#D3AF54]/30 rounded-full flex items-center justify-center mx-auto text-[#D3AF54] shadow-inner">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#FDFCF5]">Question Submitted Successfully!</h3>
              <p className="text-xs text-[#D8CFEB] max-w-md mx-auto leading-relaxed">
                Thank you, {formData.name}. Your question has been saved for review. This inquiry does not book or pay for a consultation. For anything urgent, please call +91 85277 90801.
              </p>
              <button 
                disabled={flow.busy} onClick={async() => {
                  if(!await flow.restart())return;
                  setFormData({ name: '', email: '', phone: '', location: '', question: '' });
                  setAttemptedSubmit(false);
                  setServerError("");
                }}
                className="mt-4 text-xs font-bold text-[#D3AF54] hover:text-[#EAD18D] underline cursor-pointer"
              >
                Submit another question
              </button>
            </motion.div>
          ) : (
            <form id="prashna-form" onSubmit={handleSubmit} className="space-y-4 text-left">
                  <EnquiryResume flow={flow} onResume={() => setShowOtpModal(true)} />
              {serverError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 bg-red-950/70 border border-red-500/40 rounded-xl text-red-200 text-xs md:text-sm text-center font-sans tracking-wide leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                >
                  ⚠️ {serverError}
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="prashna-name" className="block text-[11px] font-bold text-[#D3AF54] uppercase tracking-wider">
                    Full Name <span className="text-[#D3AF54]">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-3 text-[#D3AF54]/60" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      id="prashna-name" name="name" autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#241B33] text-[#FDFCF5] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition placeholder-white/40 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="prashna-email" className="block text-[11px] font-bold text-[#D3AF54] uppercase tracking-wider">
                    Email Address <span className="text-[#D3AF54]">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-3 text-[#D3AF54]/60" />
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. john@example.com"
                      id="prashna-email" name="email" autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#241B33] text-[#FDFCF5] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition placeholder-white/40 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="prashna-phone" className="block text-[11px] font-bold text-[#D3AF54] uppercase tracking-wider">
                    Mobile Number <span className="text-[#D3AF54]">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-3 text-[#D3AF54]/60" />
                    <input 
                      type="tel" 
                      required
                      placeholder="Mobile Number (e.g. 9876543210)"
                      id="prashna-phone" name="phone" autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#241B33] text-[#FDFCF5] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition placeholder-white/40 font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="prashna-location" className="block text-[11px] font-bold text-[#D3AF54] uppercase tracking-wider">
                    Current Location (City, Country) <span className="text-[#D3AF54]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-3 text-[#D3AF54]/60" />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. New Delhi, India"
                      id="prashna-location" name="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#241B33] text-[#FDFCF5] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition placeholder-white/40 font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="prashna-question" className="block text-[11px] font-bold text-[#D3AF54] uppercase tracking-wider">
                  Your Specific Question <span className="text-[#D3AF54]">*</span>
                </label>
                <textarea 
                  required
                  placeholder="e.g. Will my visa application be approved this month?"
                  id="prashna-question" name="question"
                  rows={3}
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-[#241B33] text-[#FDFCF5] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition placeholder-white/40 min-h-[90px] resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex justify-center">
                <motion.button 
                  type="submit"
                  disabled={loading}
                  whileHover={loading ? {} : { scale: 1.02, y: -1, boxShadow: "0 8px 18px rgba(211, 175, 84, 0.15), 0 0 15px rgba(211, 175, 84, 0.3)" }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`w-auto inline-flex items-center justify-center gap-2 bg-[#D3AF54] hover:bg-[#D3AF54]/95 text-[#181122] border border-[#D3AF54] font-semibold px-8 sm:px-10 py-3 rounded-xl shadow-md transition duration-300 text-xs sm:text-sm cursor-pointer font-sans ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#181122]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing Cosmic Alignments...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit your Prashna</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}

        </div>

      </div>

      <ServiceBookingStrip serviceId="prashna-kundali" title="Book time for your Prashna Kundali" />

      {/* ========================================================= */}
      {/* 5. FOOTER RETURN LINK SECTION (Warm Ivory bg-[#F4F1E3])    */}
      {/* ========================================================= */}
      <div className="w-full bg-[#F4F1E3] py-6 md:py-10 flex justify-center z-10 px-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[#AB7A57] hover:text-[#D3AF54] text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={12} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Email OTP Verification Modal */}
      <EmailOtpModal
        isOpen={showOtpModal&&!submitted} flow={flow}
        onClose={() => setShowOtpModal(false)}
        email={formData.email}
        purpose="prashna"
      />

    </div>
  );
}
