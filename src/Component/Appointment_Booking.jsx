import React, {useState,useEffect} from 'react'
import {motion,useScroll,useTransform} from 'framer-motion'
import {Send,MapPin,User,Mail,Phone,RefreshCw} from 'lucide-react'
import {useSearchParams} from 'react-router-dom'
import {useBooking} from '../lib/useBooking.js'
import {dateRange,localDate,money as formatFee,timeLabel} from '../../appointment-system/browser/booking/protocol.mjs'
import {createVerificationFields} from '../../appointment-system/browser/booking/verification-fields.mjs'
const VerificationFields=createVerificationFields(React)
import {DateField,BirthTimeField,ReceiptFields} from '../lib/booking-ui.jsx'
import '../lib/booking-experience.css'

/**
 * CelestialDivider Component
 * Elegant visual separator designed with gold gradient lines and a central star symbol.
 */
function CelestialDivider() {
  return (
    <div className="w-full flex items-center justify-center py-6 gap-4">
      <div className="h-[1px] flex-grow max-w-[150px] bg-gradient-to-r from-transparent to-[#D3AF54]/40"></div>
      <div className="text-[#D3AF54]/50 text-xs tracking-widest select-none">✦ ❖ ✦</div>
      <div className="h-[1px] flex-grow max-w-[150px] bg-gradient-to-l from-transparent to-[#D3AF54]/40"></div>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18
    }
  }
};

/**
 * Appointment_Booking Component
 * Interactive form to schedule and book personal readings.
 * Rebuilt with a luxury light palette, scroll parallax drift, glowing focus states,
 * and detailed birth chart details fields.
 */
function Appointment_Booking() {
  const [searchParams]=useSearchParams()
  const flow=useBooking(searchParams.get('service')||''),{state,dispatch}=flow
  const {scrollY}=useScroll()
  const yZodiac=useTransform(scrollY,[0,1000],[0,-80]),rZodiac=useTransform(scrollY,[0,1000],[0,35]),yHeader=useTransform(scrollY,[0,1000],[0,-30])
  const policy=state.policy?dateRange(state.policy):null
  const today=policy?.first_date||localDate()
  const services=state.policy?.policy.services.filter(service=>service.enabled)||[]
  const selectedService=services.find(service=>service.id===state.service)||null
  const formData={name:state.details.full_name,email:state.details.email,phone:state.details.phone,
    birthDate:state.details.birth_date,birthTime:state.details.birth_time,birthPlace:state.details.birth_place,
    notes:state.details.notes,readingType:state.service,questionCount:state.questions,
    bookingDate:state.day,bookingSlot:state.slot?.starts_at||''}
  const totalFee=state.quote?.amount_paise??(selectedService?selectedService.pricing.amount_paise*state.questions:0)
  const checkout=state.receipt,submitted=checkout?.appointment_state==='confirmed'
  const loading=state.busy||state.phase==='payment',unavailable=!flow.available,recoveryChecking=!!state.credential&&!checkout
  const errorMsg=state.error,paymentMessage=state.error
  const availabilityLoading=state.loadingPolicy||state.slotsStatus==='loading'
  const availabilityError=state.slotsStatus==='error'?state.error:''
  const bookingBlocked=loading||unavailable||!state.policyFresh||!state.slotsFresh||state.phase==='blocked'||!state.policy||!state.slot||!state.ack||!!state.credential||
    (state.policy.policy.booking_verification.email&&!state.verification)
  const [remainingSeconds,setRemainingSeconds]=useState(0)
  useEffect(()=>{
    if(!checkout){setRemainingSeconds(0);return}
    const anchor=performance.now(),remaining=Math.max(0,Date.parse(checkout.hold_expires_at)-Date.parse(checkout.server_now))
    const tick=()=>setRemainingSeconds(Math.max(0,Math.ceil((remaining-performance.now()+anchor)/1000)))
    tick();const timer=setInterval(tick,1000);return()=>clearInterval(timer)
  },[checkout])
  const handleInputChange=event=>{
    const {name,value}=event.target
    const fields={name:'full_name',email:'email',phone:'phone',birthDate:'birth_date',birthTime:'birth_time',birthPlace:'birth_place',notes:'notes'}
    if(name==='readingType')dispatch({type:'edit',name:'service',value})
    else if(name==='questionCount')dispatch({type:'edit',name:'questions',value:Number(value)})
    else if(fields[name]){
      if(name==='phone')dispatch({type:'details',name:'country',value:value.trim().startsWith('+')?'other':'91'})
      dispatch({type:'details',name:fields[name],value})
    }
  }
  const handleBookingSubmit=event=>{event.preventDefault();void flow.start()}
  const checkBookingStatus=flow.check,openPayment=flow.resume,resetBooking=flow.restart,retry=flow.loadPolicy

  return (
    <div className="w-full min-h-screen bg-[#F4F1E3] relative flex flex-col items-center font-sans text-[#181122]">
      
      {/* ========================================================= */}
      {/* 1. HEADER SECTION (Warm Ivory bg-[#F4F1E3])               */}
      {/* ========================================================= */}
      <div className="w-full bg-[#F4F1E3] px-6 pt-11 pb-3 lg:pt-8 lg:pb-2 flex flex-col items-center relative z-10 border-b border-[#AB7A57]/10">
        
        {/* Decorative backgrounds & rotating zodiac inside header wrapper */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(171,122,87,0.06),transparent_70%)] rounded-full -z-10 pointer-events-none animate-pulse"></div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ y: yHeader }}
          className="text-center max-w-3xl relative z-10"
        >
          <span className="text-[#8B5E3C] text-xs tracking-[0.25em] font-bold uppercase block mb-2 font-sans">
            ✦ RESERVE YOUR SPOT ✦
          </span>
          <h1 className="text-[clamp(1.5rem,2.55vw,2.8rem)] font-serif font-bold text-[#181122] tracking-wide leading-tight">
            Schedule an online consultation
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[#594C45] sm:text-base">
            {state.policy?.policy.meeting==='google_meet'?'Consultations are scheduled on Google Meet. Links are shared after appointments are booked.':'The practice will confirm the meeting arrangements for your consultation.'}
          </p>
          <div className="w-12 h-[1px] bg-[#D3AF54] mx-auto mt-3 mb-1"></div>
        </motion.div>
      </div>

      {/* ========================================================= */}
      {/* 2. BOOKING FORM                                            */}
      {/* ========================================================= */}
      <div className="w-full bg-[#F4F1E3] py-5 px-4 flex flex-col items-center relative z-10 overflow-hidden">
        
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(211,175,84,0.04),transparent_70%)] rounded-full -z-10 pointer-events-none"></div>

        {/* Rotating Background Zodiac Motif */}
        <motion.div 
          style={{ y: yZodiac, rotate: rZodiac }}
          className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02] flex justify-center items-center -z-10"
        >
          <svg className="w-[600px] h-[600px] text-[#AB7A57]" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.4">
            <circle cx="100" cy="100" r="95" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="75" />
            <circle cx="100" cy="100" r="55" strokeDasharray="2 2" />
            <line x1="100" y1="5" x2="100" y2="195" />
            <line x1="5" y1="100" x2="195" y2="100" />
          </svg>
        </motion.div>

        <div className="w-full max-w-[1600px] lg:w-[88vw] bg-[#181122] border border-[#AB7A57]/20 rounded-2xl p-4 shadow-xl relative text-white">
          
          {recoveryChecking ? (
            <div role="status" className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#F4E6BE]">
              <div><p><RefreshCw size={18} className="animate-spin" /> Checking for an appointment already in progress…</p>
              {errorMsg&&<p role="alert">{errorMsg}</p>}<button type="button" disabled={loading} onClick={flow.check}>Check saved booking</button>
              {flow.canRetryOriginal&&<button type="button" disabled={loading} onClick={flow.retryOriginal}>Retry the same request</button>}
              <a href="/booking-help">Get help with access</a></div>
            </div>
          ) : submitted ? (
            <div className="mx-auto max-w-3xl py-8 sm:py-10">
              <ReceiptFields flow={flow}/>
              <button type="button" onClick={checkBookingStatus} disabled={loading||unavailable}
                className="mt-6 min-h-11 rounded-xl border border-[#D3AF54]/65 px-5 py-2.5 text-base font-semibold text-[#F4E6BE] disabled:opacity-60">
                {loading ? 'Checking…' : 'Check booking status'}
              </button>
            </div>
          ) : checkout ? (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto flex max-w-2xl flex-col gap-5 py-7 sm:py-10"
            >
              <ReceiptFields flow={flow}/>

              {checkout.appointment_state === 'held' && (
                <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D3AF54]">Reservation time left</p>
                    <p aria-live="polite" className="mt-1 font-serif text-2xl font-semibold text-white">
                      {String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:{String(remainingSeconds % 60).padStart(2, '0')}
                    </p>
                  </div>

                </div>
              )}

              {paymentMessage && <p role="status" className="rounded-xl bg-white/7 px-4 py-3 text-sm leading-relaxed text-[#F4E6BE]">{paymentMessage}</p>}

              <div className="flex flex-wrap gap-3">
                {checkout.next_actions.includes('resume_payment') && (
                  <button type="button" onClick={openPayment} disabled={loading}
                    className="min-h-11 rounded-xl bg-[#D3AF54] px-6 py-2.5 text-sm font-semibold text-[#181122] transition hover:bg-[#E1BE65] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4E6BE] disabled:cursor-wait disabled:opacity-60">
                    {loading ? 'Preparing secure payment…' : `Pay ${formatFee(checkout.amount_paise)} securely`}
                  </button>
                )}
                {(checkout.appointment_state === 'held' || checkout.appointment_state === 'payment_review') && (
                  <button type="button" onClick={checkBookingStatus} disabled={loading}
                    className="min-h-11 rounded-xl border border-[#D3AF54]/65 px-5 py-2.5 text-sm font-semibold text-[#F4E6BE] transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F4E6BE] disabled:cursor-wait disabled:opacity-60">
                    Check payment status
                  </button>
                )}
                {checkout.next_actions.includes('choose_new_time') && (
                  <button type="button" onClick={resetBooking}
                    className="min-h-11 rounded-xl bg-[#D3AF54] px-6 py-2.5 text-sm font-semibold text-[#181122]">
                    Choose another time
                  </button>
                )}
              </div>
            </motion.section>
          ) : (
            <motion.form 
              id="booking-form"
              onSubmit={handleBookingSubmit} 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="astro-booking-form grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-4 xl:gap-3 items-start scroll-mt-20 w-full"
            >
              {/* Error Message Display (Real-time Validation Alert) */}
              {errorMsg && !availabilityError && (
                <motion.div 
                  role="alert"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-1 lg:col-span-2 xl:col-span-3 p-3 bg-red-950/70 border border-red-500/40 rounded-xl text-red-200 text-xs md:text-sm text-center font-sans tracking-wide leading-relaxed shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                >
                  ⚠️ {errorMsg}
                  {!state.policy&&!state.credential&&<button type="button" disabled={state.loadingPolicy||loading} onClick={retry} className="block mx-auto mt-2 underline underline-offset-4">Reload consultation details</button>}
                </motion.div>
              )}

              <div className="contents xl:flex xl:flex-col xl:gap-3">
                {/* Step 1: Personal Contact Details Card */}
                <motion.div variants={itemVariants} className="space-y-3 text-left bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col justify-start">
                <h3 className="font-serif text-sm sm:text-base font-bold !text-[#D3AF54] border-b border-[#AB7A57]/20 pb-1.5">
                  Personal Contact Details
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-wider text-[#D3AF54]/95">
                      Full Name <span className="text-[#D3AF54]">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-2.5 text-[#D3AF54]/60" />
                      <input 
                        type="text" 
                        id="name"
                        name="name"
                        autoComplete="name" minLength={2} maxLength={100}
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition-all duration-300 placeholder-white/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wider text-[#D3AF54]/95">
                      Email Address {state.policy?.policy.booking_verification.email?<span className="text-[#D3AF54]">*</span>:<span className="text-white/70 normal-case font-normal">(Optional)</span>}
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-2.5 text-[#D3AF54]/60" />
                      <input 
                        type="email" 
                        id="email"
                        name="email"
                        autoComplete="email" maxLength={254}
                        required={state.policy?.policy.booking_verification.email===true}
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your email"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition-all duration-300 placeholder-white/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-[11px] font-semibold uppercase tracking-wider text-[#D3AF54]/95">
                      Mobile Number <span className="text-[#D3AF54]">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-2.5 text-[#D3AF54]/60" />
                      <input 
                        type="tel" 
                        id="phone"
                        name="phone"
                        autoComplete="tel-national" maxLength={30}
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition-all duration-300 placeholder-white/40"
                      />
                    </div>
                  </div>
                </div>
                </motion.div>

                {/* Step 2: Cosmic Birth Credentials Card */}
                <motion.div variants={itemVariants} className="space-y-3 text-left bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col justify-start">
                <h3 className="font-serif text-sm sm:text-base font-bold !text-[#D3AF54] border-b border-[#AB7A57]/20 pb-1.5">
                  Birth Details
                </h3>
                    
                <div className="astro-birth-fields gap-3">
                  <DateField label="Date of birth (Optional)" name="birthDate" value={formData.birthDate}
                    max={localDate(state.policy?.server_now||new Date(),state.policy?.policy.timezone||'Asia/Kolkata')}
                    yearJump theme="abs-theme-astro" available={flow.viewAvailable} disabled={loading}
                    onChange={value=>dispatch({type:'details',name:'birth_date',value})}/>
                  <BirthTimeField label="Exact time of birth (Optional)" name="birthTime" value={formData.birthTime}
                    theme="abs-theme-astro" available={flow.viewAvailable} disabled={loading}
                    required={selectedService?.required_preparation.includes('birth_time')}
                    onChange={value=>dispatch({type:'details',name:'birth_time',value})}/>

                  <div className="space-y-1 sm:col-span-2">
                    <label htmlFor="birthPlace" className="block text-[11px] font-semibold uppercase tracking-wider text-[#D3AF54]/95">
                      Place of Birth (City/State) <span className="text-white/50 text-[10px] normal-case font-normal italic">(Optional)</span>
                    </label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-2.5 text-[#D3AF54]/60" />
                      <input 
                        type="text" 
                        id="birthPlace"
                        name="birthPlace"
                      maxLength={200} required={selectedService?.required_preparation.includes('birth_place')}
                        value={formData.birthPlace}
                        onChange={handleInputChange}
                        placeholder="City, State, Country"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition-all duration-300 placeholder-white/40"
                      />
                    </div>
                  </div>
                </div>
                </motion.div>
              </div>

              {/* Step 3: Date Selection Calendar Card */}
              <motion.div variants={itemVariants} className="space-y-3 text-left bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col justify-start">
                <h3 className="font-serif text-sm sm:text-base font-bold !text-[#D3AF54] border-b border-[#AB7A57]/20 pb-1.5">
                  Select Date
                </h3>
                <p className="text-sm leading-relaxed text-white/80">Times shown in {state.policy?.policy.timezone||'Asia/Kolkata'}. Select a date to see the available times.</p>
                {policy && <p className="text-xs leading-relaxed text-white/70">{new Date(`${policy.first_date}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })} – {new Date(`${policy.last_date}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })}</p>}
                
                <DateField label="Appointment date" name="bookingDate" required value={formData.bookingDate}
                  min={policy?.first_date} max={policy?.last_date} disabled={loading||!policy} available={flow.viewAvailable}
                  theme="abs-theme-astro" onChange={value=>dispatch({type:'edit',name:'day',value})}/>
              </motion.div>

              {/* Step 4: Consultation Details Card */}
              <motion.div variants={itemVariants} className="space-y-3 text-left bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg h-full flex flex-col justify-start">
                <h3 className="font-serif text-sm sm:text-base font-bold !text-[#D3AF54] border-b border-[#AB7A57]/20 pb-1.5">
                  Consultation Details
                </h3>
                  
                <div className="space-y-3">
                  {/* Consultation Type Selector */}
                  <div className="space-y-1">
                    <label htmlFor="readingType" className="block text-[11px] font-semibold uppercase tracking-wider text-[#D3AF54]/95">
                      Consultation Type
                    </label>
                    <select 
                      id="readingType"
                      name="readingType"
                      value={formData.readingType}
                      onChange={handleInputChange}
                      className="w-full bg-[#181122] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition-all duration-300 cursor-pointer"
                    >
                      <option value="" disabled>Choose a consultation</option>
                      {services.map(service => <option key={service.id} value={service.id}>{service.name} ({formatFee(service.pricing.amount_paise)}{service.pricing.kind==='per_question' ? ' per question' : ''})</option>)}
                    </select>
                  </div>

                  {selectedService?.pricing.kind==='per_question' && <div className="space-y-2">
                    <label htmlFor="questionCount" className="block text-sm font-semibold text-[#D3AF54]">Number of questions</label>
                    <select id="questionCount" name="questionCount" value={formData.questionCount} onChange={handleInputChange} className="w-full rounded-xl border border-white/20 bg-[#181122] px-3 py-2 text-sm text-white">
                      {Array.from({ length: selectedService.pricing.maximum_questions }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {count === 1 ? 'question' : 'questions'}</option>)}
                    </select>
                    <p className="text-sm leading-relaxed text-white/80">Additional questions during the consultation are charged at {formatFee(selectedService.pricing.amount_paise)} each, payable at that time.</p>
                  </div>}
                  <p aria-live="polite" className="text-sm font-semibold text-[#D3AF54]">{selectedService ? <>Total: {formatFee(totalFee)}</> : 'Choose a consultation to see the fee.'}</p>


                  {/* Choose Time Button Grid */}
                  <div className="space-y-1.5 text-left">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#D3AF54]/95">
                      Choose Time · {policy?.timezone||'Local practice time'}
                    </label>
                    
                    {availabilityError && <div role="alert" className="text-sm leading-relaxed text-amber-200"><p>{availabilityError}</p><button type="button" onClick={retry} className="mt-2 min-h-11 underline underline-offset-4">Try again</button></div>}
                    {availabilityLoading && formData.bookingDate && <p role="status" className="text-sm text-white/80">
                      {state.slots.length ? 'Refreshing available times…' : 'Checking available times…'}
                    </p>}
                    {state.slotsStatus==='ready'&&state.slots.length===0&&<p role="status" className="text-sm leading-relaxed text-white/80">There are no available times on this day. Please choose another date.</p>}
                    {!formData.bookingDate ? (
                      <div className="text-sm leading-relaxed text-white/80 border border-white/10 bg-white/5 rounded-xl p-3 text-center">
                        ✦ Please select a date on the calendar first to view available times.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-2 gap-2">
                        {state.slots.map(value => ({...value,value:value.starts_at,label:timeLabel(value.starts_at,policy.timezone)})).map((slot) => {
                          const isAvailable = true;
                          const isSelected = formData.bookingSlot === slot.value;
                          
                          return (
                            <button
                              key={slot.value}
                              type="button"
                              disabled={!isAvailable||!flow.available||!state.slotsFresh}
                              aria-label={`${slot.label}, ${isAvailable ? 'open' : 'unavailable'}`}
                              data-booking-time={slot.starts_at}
                              aria-pressed={isSelected}
                              onClick={() => dispatch({type:'edit',name:'slot',value:slot})}
                              className={`flex min-h-11 items-center justify-between gap-2 px-2.5 py-2 rounded-xl border text-left transition-all duration-300 ${
                                !isAvailable
                                  ? "bg-white/5 border-white/10 text-white/60 cursor-not-allowed"
                                  : isSelected
                                    ? "bg-[#D3AF54] border-[#D3AF54] text-[#181122] shadow-[0_0_12px_rgba(211,175,84,0.3)] font-bold scale-[1.02]"
                                    : "bg-white/5 border-white/10 hover:border-[#D3AF54] text-white cursor-pointer hover:bg-white/10"
                              }`}
                            >
                              <span className="text-sm font-semibold whitespace-nowrap">{slot.label.split(' – ')[0]}</span>
                              
                              <div className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  !isAvailable 
                                    ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
                                    : "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                                }`} />
                                <span className="text-[10px] font-semibold">
                                  {isAvailable ? "Open" : "Closed"}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Additional Notes / Concerns / Comments */}
                  <div className="space-y-1 text-left">
                    <label htmlFor="notes" className="block text-[11px] font-semibold uppercase tracking-wider text-[#D3AF54]/95">
                      Additional Concerns or Questions
                    </label>
                    <textarea 
                      id="notes"
                      name="notes"
                      maxLength={4000} required={selectedService?.required_preparation.includes('notes')}
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any specific questions for Kundan Singh?"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D3AF54] focus:ring-2 focus:ring-[#D3AF54]/15 transition-all duration-300 placeholder-white/40 resize-none min-h-[55px]"
                    />
                  </div>
                </div>
              </motion.div>

              <div className="col-span-1 lg:col-span-2 xl:col-span-3 space-y-3">
                <VerificationFields flow={flow} className="space-y-2" inputClassName="rounded border p-2" buttonClassName="rounded border px-3 py-2"/>
                <label className="flex items-start gap-2"><input type="checkbox" checked={state.ack} disabled={loading||!flow.available} onChange={event=>dispatch({type:'ack',value:event.target.checked})}/><span>I have checked my appointment and contact details and read the <a href="/terms-and-conditions" className="underline">terms</a> and <a href="/refund-policy" className="underline">cancellation policy</a>.</span></label>
              </div>
              {/* Submit Button - Width strictly spans text */}
              <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 xl:col-span-3 flex justify-center pt-2">
                <motion.button 
                  type="submit"
                  disabled={bookingBlocked}
                  whileHover={bookingBlocked ? {} : { scale: 1.02, y: -1, boxShadow: "0 8px 18px rgba(211, 175, 84, 0.15), 0 0 15px rgba(211, 175, 84, 0.3)" }}
                  whileTap={bookingBlocked ? {} : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`w-auto px-8 sm:px-10 bg-[#D3AF54] hover:bg-[#D3AF54]/95 text-[#181122] border border-[#D3AF54] font-semibold py-3 rounded-xl transition duration-300 shadow-md cursor-pointer inline-flex items-center justify-center gap-2 text-xs sm:text-sm ${bookingBlocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#181122]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing Booking Request...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Appointment Request</span>
                    </>
                  )}
                </motion.button>
              </motion.div>

            </motion.form>
          )}
        </div>

        {/* Cancellation Notice */}
        <div className="mt-5 mb-8 max-w-4xl w-full px-4 flex justify-center">
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-center justify-center gap-3 w-auto">
            <span className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-[#AB7A57] shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            <p className="text-xs text-slate-600 font-sans text-center leading-relaxed whitespace-normal sm:whitespace-nowrap">
              <strong className="font-bold text-[#33233D]">Need to cancel your session?</strong> Please call <a href="tel:+918527790801" className="text-[#8F5F3E] hover:underline font-bold">+91 85277 90801</a>.
            </p>
          </div>
        </div>

      </div>


    </div>
  )
}

export default Appointment_Booking
