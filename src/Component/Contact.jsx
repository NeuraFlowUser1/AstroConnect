import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Phone, 
  Mail, 
  MapPin, 
  CalendarClock,
  Send, 
  User, 
  Check, 
  Copy,
  ChevronDown,
  MessageSquare,
  HelpCircle
} from 'lucide-react'
import EmailOtpModal, {EnquiryResume} from './EmailOtpModal'
import './Contact.css'
import gmailLogo from "../assets/logos/gmail.webp"
import mapsLogo from "../assets/logos/google-maps.webp"
import waLogo from "../assets/logos/whatsapp.webp"

import {useEnquiry} from '../lib/useEnquiry.js'
import {useBookingProduct} from '../lib/BookingProduct.jsx'

const faqs = [
  {
    q: "What birth details are required?",
    a: "We need your exact Date of Birth, exact Time of Birth (within a few minutes), and Place of Birth (city and state/country) for precise chart calculations."
  },
  {
    q: "How are website bookings conducted?",
    a: "All appointments booked through this website are online on Google Meet. After payment and confirmation, the meeting link is sent to your email."
  },
  {
    q: "How do I cancel or ask about a refund?",
    a: "Please call +91 85277 90801. Cancellations and any refund arrangements are handled manually by the studio; cancelling does not issue an automatic refund."
  },
  {
    q: "What does a consultation include?",
    a: "A consultation includes an analysis relevant to your chosen service and an opportunity to discuss your questions."
  }
];

function Contact() {
  const {enabled}=useBookingProduct()
  const helpFormRef = useRef(null)
  const flow=useEnquiry('contact')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  })
  
  const submitted=flow.receipt?.state==='received'
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [localError,setServerError]=useState("")
  const serverError=localError||flow.error
  const [currentWhatsappUrl, setCurrentWhatsappUrl] = useState("")
  const [showOtpModal, setShowOtpModal] = useState(false)
  useEffect(()=>{if(flow.started&&flow.receipt?.state!=='received')setShowOtpModal(true)},[flow.started,flow.receipt?.state])
  const submitting=flow.busy||flow.blocked||flow.waiting>0
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [copiedType, setCopiedType] = useState(null)
  const [showFaq, setShowFaq] = useState(true)
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updated = { ...prev };
      updated[name] = value;
      return updated;
    })
  }

  const validateContactForm = () => {
    let isValid = true
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required."
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required."
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address."
      isValid = false
    }

    const phoneClean = formData.phone.replace(/[\s\-]/g, "")
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required."
      isValid = false
    } else if (!/^\+?[0-9]{7,15}$/.test(phoneClean)) {
      newErrors.phone = "Enter a valid phone number (7-15 digits)."
      isValid = false
    }

    if (!formData.subject) {
      newErrors.subject = "Please select an inquiry topic."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  useEffect(() => {
    if (attemptedSubmit) {
      validateContactForm()
    }
  }, [formData, attemptedSubmit])

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setAttemptedSubmit(true)
    setServerError("")
    
    if (!validateContactForm()) {
      return
    }

    if(submitting)return
    setCurrentWhatsappUrl('https://wa.me/918527790801?text='+encodeURIComponent('Enquiry from '+formData.name.trim()+': '+formData.message.trim()))
    setShowOtpModal(true)
    await flow.start({source:'contact',name:formData.name,email:formData.email,phone:formData.phone.trim().startsWith('+')?formData.phone.trim():'+91'+formData.phone.replace(/[\s()-]/g,''),
      subject:formData.subject,message:formData.message||'Please contact me about this inquiry.'})
  }

  const handleCopyText = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(null), 2000)
  }

  return (
    <div className="w-full min-h-screen bg-[#FDFCF5] relative flex flex-col items-center justify-start font-sans text-[#181122]">
      
      {/* ========================================================= */}
      {/* 2. CONTACT DETAILS & FORM                                 */}
      {/* ========================================================= */}
      <div className="w-full bg-[#FDFCF5] pt-4 sm:pt-6 pb-16 px-4 flex flex-col items-center relative z-10 overflow-hidden">
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[radial-gradient(circle_at_center,rgba(211,175,84,0.03),transparent_70%)] rounded-full -z-10 pointer-events-none"></div>

        {/* Header Area directly above the box */}
        <div className="text-center max-w-xl relative flex flex-col items-center mb-6">
          <span className="text-[#8B5E3C] text-xs sm:text-sm tracking-[0.25em] font-bold uppercase mb-1">
            ✦ CONNECT WITH THE STARS ✦
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#181122] tracking-wide mt-1 mb-2">
            Contact Our Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#181122]/70 font-sans leading-relaxed">
            Have questions or want to request a reading? Reach out to Astrologer Kundan Singh.
          </p>
          <div className="w-12 h-[2px] bg-[#D3AF54] mt-3"></div>
        </div>

        {/* Main Split Panel Card */}
        <div className="w-full max-w-4xl bg-white border border-[#AB7A57]/15 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Side: Clean Brand Info Panel */}
          <div className="md:col-span-5 bg-[#181122] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Subtle Zodiac pattern background overlay */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
              <svg className="w-80 h-80 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                <circle cx="50" cy="50" r="45" strokeDasharray="2 2" />
                <line x1="50" y1="5" x2="50" y2="95" />
                <line x1="5" y1="50" x2="95" y2="50" />
              </svg>
            </div>

            <div className="space-y-5 relative z-10 text-left">
              <div className="pb-1 space-y-1">
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#D3AF54] tracking-wide">
                  Astroadvice Studio
                </h3>
                <p className="text-xs sm:text-sm text-[#D8CFEB] leading-relaxed font-sans">
                  Guiding seekers with authentic Vedic forecasts and planetary transits support.
                </p>
              </div>

              {/* Compact Details Rows */}
              <div className="space-y-3.5 pt-1">
                {/* WhatsApp Row */}
                <a 
                  href="https://wa.me/918527790801" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 group hover:text-[#D3AF54] transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <img src={waLogo} alt="WhatsApp" className="w-5.5 h-5.5 object-contain" />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-serif font-bold tracking-wider leading-none" style={{ color: '#AB7A57' }}>
                      WhatsApp Support
                    </div>
                    <p className="text-sm font-semibold text-[#D8CFEB] mt-1 group-hover:text-white transition-colors">Start Live Chat</p>
                  </div>
                </a>

                {/* One shared phone icon, with both direct-call and copy actions. */}
                <div className="contact-phone-group flex items-start gap-3 w-full">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#D3AF54]">
                    <Phone size={20} strokeWidth={1.7} aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase font-serif font-bold tracking-wider leading-none text-[#AB7A57]">Call Us</div>
                    {[
                      { number: '+918130808758', label: '+91 8130808758', key: 'phone' },
                      { number: '+918527790801', label: '+91 8527790801', key: 'phone2' },
                    ].map(({ number, label, key }) => (
                      <div key={key} className="flex items-center justify-between gap-2">
                        <a href={`tel:${number}`} className="contact-phone-number text-sm font-semibold text-[#D8CFEB] hover:text-[#D3AF54] transition-colors">{label}</a>
                        <button type="button" onClick={() => handleCopyText(number, key)} aria-label={`Copy ${label}`} className="contact-copy-phone rounded-lg text-[#D8CFEB] hover:text-[#D3AF54] hover:bg-white/5 transition cursor-pointer relative shrink-0">
                          {copiedType === key ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                          {copiedType === key && <span role="status" className="absolute -top-8 right-0 bg-black text-white text-xs px-2 py-1 rounded shadow">Copied</span>}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Email Row */}
                <div className="flex items-center justify-between group">
                  <a href="mailto:astroadvicebyks@gmail.com" className="flex items-center gap-3 hover:text-[#D3AF54] transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <img src={gmailLogo} alt="Email" className="w-4.5 h-4.5 object-contain" />
                    </div>
                    <div>
                      <div className="text-xs uppercase font-serif font-bold tracking-wider leading-none" style={{ color: '#AB7A57' }}>
                        Email Helpline
                      </div>
                      <p className="text-sm font-semibold text-[#D8CFEB] mt-1 truncate max-w-[140px] sm:max-w-none">astroadvicebyks@gmail.com</p>
                    </div>
                  </a>
                  <button 
                    type="button"
                    onClick={() => handleCopyText("astroadvicebyks@gmail.com", "email")}
                    aria-label="Copy astroadvicebyks@gmail.com"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#D8CFEB] hover:text-[#D3AF54] transition cursor-pointer relative shrink-0"
                  >
                    {copiedType === "email" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    {copiedType === "email" && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded shadow">Copied</span>
                    )}
                  </button>
                </div>

                {/* Office Location */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D3AF54] shrink-0 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-xs uppercase font-serif font-bold tracking-wider leading-none" style={{ color: '#AB7A57' }}>
                      Main Office
                    </div>
                    <p className="text-xs text-[#D8CFEB] mt-1 leading-snug font-sans">
                      B-23 Shantikunj, B-Block, Avenue-9, Church Road, Vasant Kunj, New Delhi - 110070
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Hours / Map Button */}
            <div className="pt-4 border-t border-white/10 mt-5 relative z-10 text-left space-y-2.5">
              <div className="contact-office-hours text-xs text-slate-300 flex items-start gap-3">
                <CalendarClock size={22} strokeWidth={1.7} className="shrink-0 text-[#D3AF54]" aria-hidden="true" />
                <div className="grid gap-1">
                  <span className="font-semibold text-[#F4EFDF]">Monday–Saturday</span>
                  <span>10 am–12 pm</span>
                  <span>3 pm–6 pm</span>
                </div>
              </div>
              <div className="w-full rounded-xl overflow-hidden border border-white/10 shadow-md">
                <iframe 
                  title="Astrologer Kundan Singh Location Map"
                  src="https://maps.google.com/maps?q=B-23%2C%20Shanti%20Kunj%2C%20Church%20Road%2C%20Vasant%20Kunj%2C%20New%20Delhi%2C%20Delhi%20110070&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                  className="w-full h-36 border-0 rounded-xl"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>

              <a 
                href="https://www.google.com/maps/search/?api=1&query=B-23,+Shanti+Kunj,+Church+Road,+Vasant+Kunj,+New+Delhi,+Delhi+110070" 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-white/5 border border-white/10 hover:bg-[#D3AF54] text-[#D8CFEB] hover:text-[#181122] text-xs uppercase font-bold py-3 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 shadow"
              >
                <img src={mapsLogo} alt="Maps" className="w-4.5 h-4.5 object-contain" />
                <span>Open Google Directions</span>
              </a>
            </div>
          </div>

          {/* Right Side: Clean Compact Form Panel */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between h-full">
            {submitted ? (
              <div className="text-center py-6 space-y-4 my-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center text-emerald-600 text-xl mx-auto shadow-sm">
                  ✓
                </div>
                <h4 className="font-serif font-bold text-[#181122] text-lg tracking-wide">Message Submitted!</h4>
                <p className="text-[11px] text-slate-500 font-sans max-w-xs mx-auto leading-relaxed">
                  Thank you. Your inquiry has been saved. For anything urgent, please call +91 85277 90801 or contact us on WhatsApp below.
                </p>
                
                <div className="max-w-xs mx-auto pt-2 flex flex-col gap-2.5">
                  {/* WhatsApp backup live-chat direct link */}
                  <a 
                    href={currentWhatsappUrl||'https://wa.me/918527790801'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 text-xs shadow w-full uppercase tracking-wider font-sans cursor-pointer hover:scale-[1.02]"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.022-.079-.186-.208-.432-.332-.246-.125-1.453-.717-1.677-.799-.224-.083-.388-.124-.552.124-.164.248-.636.799-.78 1.002-.144.202-.288.227-.534.103-.247-.124-.967-.356-1.842-1.139-.68-.606-1.138-1.353-1.272-1.584-.134-.23-.014-.354.11-.478.11-.112.247-.29.37-.435.124-.144.164-.247.247-.413.082-.164.041-.309-.02-.433-.062-.124-.552-1.332-.756-1.823-.198-.477-.399-.413-.55-.413-.142-.002-.306-.002-.471-.002-.165 0-.435.062-.662.309-.227.247-.866.845-.866 2.062 0 1.218.887 2.395.986 2.548.099.15 1.745 2.664 4.228 3.733.59.255 1.05.408 1.408.522.593.189 1.133.162 1.558.1.474-.071 1.453-.593 1.657-1.137.204-.544.204-1.01.144-1.107L17.472 14.382zM12 2C6.478 2 2 6.478 2 12c0 1.91.536 3.693 1.464 5.228L2 22l4.908-1.294C8.36 21.572 10.106 22 12 22c5.522 0 10-4.478 10-10S17.522 2 12 2zm0 18c-1.634 0-3.15-.472-4.436-1.282l-.318-.202-2.923.77.784-2.85-.22-.352C3.968 14.86 3.5 13.5 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/>
                    </svg>
                    <span>Continue on WhatsApp</span>
                  </a>
                </div>
                
                <button 
                  type="button" 
                  disabled={flow.busy} onClick={async() => {
                    if(!await flow.restart())return
                    setAttemptedSubmit(false)
                    setCurrentWhatsappUrl("")
                    setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" })
                  }}
                  className="text-slate-400 hover:text-slate-600 transition text-[11px] underline mt-3 block mx-auto cursor-pointer font-sans"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="contact-message-form text-left flex flex-col justify-between h-full">
                  <EnquiryResume flow={flow} onResume={() => setShowOtpModal(true)} />
                {serverError && (
                  <div role="alert" className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-900 text-sm text-center font-sans leading-relaxed">
                    ⚠️ {serverError}
                  </div>
                )}
                {/* Symmetrical Header */}
                <div className="pb-1 space-y-1">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#8B5E3C] tracking-wide">
                    Send Us a Message
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
                    Fill in your details below to submit your query directly to our studio.
                  </p>
                </div>
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                    Full Name <span className="text-[#D3AF54]">*</span>
                  </label>
                  <div className="relative">
                    <User size={13} className="absolute left-3.5 top-3.5 text-[#AB7A57]" />
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#FDFCF5] border border-[#AB7A57]/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#181122] focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition font-sans"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-[10px] font-sans font-medium mt-1">⚠️ {errors.name}</p>
                  )}
                </div>

                {/* Email and Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                      Email Address <span className="text-[#D3AF54]">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3.5 top-3.5 text-[#AB7A57]" />
                      <input 
                        type="text" 
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. john@example.com"
                        className="w-full bg-[#FDFCF5] border border-[#AB7A57]/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#181122] focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition font-sans"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-[10px] font-sans font-medium mt-1">⚠️ {errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                      Mobile Number <span className="text-[#D3AF54]">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={13} className="absolute left-3.5 top-3.5 text-[#AB7A57]" />
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-[#FDFCF5] border border-[#AB7A57]/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#181122] focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition font-sans"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-[10px] font-sans font-medium mt-1">⚠️ {errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Subject Selector dropdown */}
                <div className="space-y-1.5 relative">
                  <label htmlFor="subject" className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                    Inquiry Topic
                  </label>
                  <div className="relative">
                    <MessageSquare size={13} className="absolute left-3.5 top-3.5 text-[#AB7A57]" />
                    <select 
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-[#FDFCF5] border border-[#AB7A57]/30 rounded-xl pl-9 pr-10 py-2.5 text-xs text-[#181122] focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition appearance-none cursor-pointer font-serif font-bold"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Birth Chart Reading">Birth Chart Reading</option>
                      <option value="Match Making (Kundli Milan)">Match Making (Kundli Milan)</option>
                      <option value="Vastu Consultation">Vastu Consultation</option>

                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-[#AB7A57] pointer-events-none" />
                  </div>
                </div>

                {/* Message Box */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="block text-[11px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                    Your Message / Question <span className="text-slate-600 text-[10px] normal-case font-normal italic">(Optional)</span>
                  </label>
                  <textarea 
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your situation or list any key questions you want answered..."
                    className="w-full bg-[#FDFCF5] border border-[#AB7A57]/30 rounded-xl px-4 py-2.5 text-xs text-[#181122] focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition min-h-[100px] resize-none font-sans"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-[#181122] hover:bg-[#D3AF54] text-white hover:text-[#181122] font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow"
                  >
                    <Send size={13} />
                    <span>Submit Message</span>
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FAQ ACCORDION SECTION (Warm Sand bg-[#EDE9D7])          */}
      {/* ========================================================= */}
      <div className="w-full bg-[#EDE9D7] py-16 px-4 flex flex-col items-center relative z-10">
        <div className="w-full max-w-4xl px-4 relative">
          
          {/* Header / Toggle */}
          <div className="text-center mb-6">
            <span className="text-[#8B5E3C] text-xs font-bold uppercase tracking-widest block mb-2">✦ GOT QUESTIONS? ✦</span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#181122]">Frequently Asked Questions</h3>
          </div>

          <div className="mt-4 space-y-2.5 max-w-2xl mx-auto transition-all duration-300">
            {faqs.map((item, idx) => {
              const faq=!enabled&&idx===1?{q:'How do I arrange a consultation?',a:'Please call the practice to discuss a suitable time and meeting arrangements.'}:item
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl bg-white text-left overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-3.5 flex items-center justify-between text-left text-sm font-serif font-bold text-[#181122] hover:text-[#AB7A57] focus:outline-none cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={14} className={`text-[#D3AF54] transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 pt-1.5 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed font-sans">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </div>

      {/* Email OTP Verification Modal */}
      <EmailOtpModal
        isOpen={showOtpModal&&!submitted} flow={flow}
        onClose={() => setShowOtpModal(false)}
        email={formData.email}
        purpose="contact"
      />

    </div>
  )
}

export default Contact
