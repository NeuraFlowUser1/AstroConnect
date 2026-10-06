import { useEffect, useRef } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom';
import {BookingLink as Link} from '../lib/BookingProduct.jsx';
import { ArrowDown, ArrowRight, Calendar, MessageCircle } from 'lucide-react'
import { publicServices } from '../data/publicServices'
import { ServiceArtwork, ServiceFocus, ServiceIcon, ServicePrice } from './ServicePresentation'
import './Service.css'

const directionContract = `THESIS: Six illustrated chapters clarify choosing a consultation without a hidden hover catalogue.
OWN-WORLD: Incumbent navy, gold and beige; Source Serif 4 headings, Source Sans 3 text, square section seams and offset artwork frames.
STORY: Recognise a concern, compare focus and price, open details or book; request help when unsure.
FIRST VIEWPORT: Compact centred introduction, six quick links and the first large artwork-led service with visible actions.
FORM: Alternating horizontal chapters, first-ranked of six evaluated structures; seed not used because the designer explicitly delegated best-fit selection. Selected comp: services-chapters.png.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md`

/**
 * Service Component
 * Displays available astrological services with luxury light styling,
 * spring-based hover effects, glowing drop-shadows, and scroll parallax decors.
 * The approved refinement replaces the hover catalogue with illustrated chapters;
 * short assembly and lifted artwork preserve depth without hiding useful content.
 */
function Service() {
  const rootRef = useRef(null)
  const [searchParams] = useSearchParams()
  const navigationKey = useLocation().key
  const focus = searchParams.get('focus')

  useEffect(() => {
    const root = rootRef.current
    const comment = document.createComment(directionContract)
    root.prepend(comment)
    const header = document.querySelector('header')
    const measure = () => root.style.setProperty('--services-header', `${header?.getBoundingClientRect().height || 85}px`)
    const resize = new ResizeObserver(measure)
    if (header) resize.observe(header)
    measure()
    // Readable by default; the observer only adds a once-only assembly flourish.
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.dataset.revealed = 'true'
        observer.unobserve(entry.target)
      }
    }), { threshold: 0.18 })
    root.querySelectorAll('.service-chapter').forEach(section => observer.observe(section))
    return () => { comment.remove(); resize.disconnect(); observer.disconnect() }
  }, [])

  useEffect(() => {
    if (!publicServices.some(service => service.id === focus)) return
    const frame = requestAnimationFrame(() => {
      const section = document.getElementById(`consultation-${focus}`)
      section?.focus({ preventScroll: true })
      section?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [focus, navigationKey])

  return (
    <div className="services-page" ref={rootRef}>
      {/* 1. HEADER SECTION (Warm Ivory bg-[#F4F1E3]) */}
      <section className="services-intro services-container" aria-labelledby="services-title">
        <h1 id="services-title">Guidance for every<br className="services-title-break" /> chapter of life.</h1>
        <p>From a bigger life question to a change of name, find the consultation that speaks to you.</p>
        <nav className="services-index" aria-label="Explore the six consultations">
          {publicServices.map(service => <Link key={service.id} to={`/services?focus=${service.id}`}>
            <ServiceIcon name={service.icon} /><span>{service.title}</span><ArrowDown aria-hidden="true" className="service-index-arrow" />
          </Link>)}
        </nav>
      </section>

      {/* 2. SERVICES GRID — expanded into six alternating illustrated chapters. */}
      <div className="services-chapters">
        {publicServices.map((service, index) => <section
          key={service.id} id={`consultation-${service.id}`} tabIndex={-1}
          className={`service-chapter ${index % 2 ? 'service-chapter--reverse' : ''}`}
          aria-labelledby={`service-title-${service.id}`}
        >
          <div className="service-chapter-inner services-container">
            <ServiceArtwork service={service} eager={index === 0} />
            <div className="service-copy">
              <h2 id={`service-title-${service.id}`}>{service.title}</h2>
              <p className="service-description">{service.description}</p>
              <ServiceFocus service={service} />
              <div className="service-bottom">
                <ServicePrice service={service} />
                <div className="service-actions">
                  <Link className="service-button service-button--outline" to={`/services/${service.id}`} aria-label={`Read more about ${service.title}`}>Read More <ArrowRight aria-hidden="true" /></Link>
                  <Link className="service-button service-button--gold" to={`/booking?service=${service.id}`} aria-label={`Book ${service.title}`}><Calendar aria-hidden="true" />Book Now</Link>
                </div>
              </div>
            </div>
          </div>
        </section>)}
      </div>

      {/* 3. CALL TO ACTION — a useful close, not another catalogue. */}
      <section className="services-help">
        <div className="services-container services-help-inner">
          <div><h2>Not sure where to begin?</h2><p>Tell us what’s on your mind. We’ll help you choose a consultation.</p></div>
          <a className="service-button service-button--gold" href="https://wa.me/918527790801?text=Hello%20Astrologer%20Kundan%20Singh,%20I%20need%20guidance%20on%20which%20consultation%20reading%20fits%20my%20situation." target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" />Let’s Talk</a>
        </div>
      </section>
    </div>
  )
}

export default Service
