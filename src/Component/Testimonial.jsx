import { useState, useEffect, useRef } from 'react'
import {BookingLink as Link} from '../lib/BookingProduct.jsx'
import { useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, ArrowDown, ArrowRight, Quote } from 'lucide-react'
import { featuredReviews, consultationStories, reviewFilters, reviews } from '../data/testimonialContent'
import careerArt from '../assets/images/testimonial-career.webp'
import homeArt from '../assets/images/testimonial-home.webp'
import nameArt from '../assets/images/testimonial-name.webp'
import closingLandscape from '../assets/images/testimonial-closing-landscape.webp'
import './Testimonial.css'

const storyArtwork = { career: careerArt, home: homeArt, name: nameArt }
const getReviewPool = filter => filter === 'all' ? reviews : reviews.filter(review => review.serviceId === filter)
const reviewWindowSize = filter => filter === 'all' ? 6 : 3
const directionContract = [
  'THESIS: Keep the familiar rotating voice, then add context and a gently changing review collection rather than an endless wall of praise.',
  'OWN-WORLD: Existing navy, gold and beige; Source Serif 4 headings and quotation, Source Sans 3 reading text, restrained engraved illustrations and square section seams.',
  'STORY: Read a featured voice, understand three consultation journeys, browse concise reviews, choose a service or book.',
  'FIRST VIEWPORT: Light, centred viewport-minus-header scene; readable rotating review, arrows and dots, booking and story links.',
  'FORM: User-approved four-part extension; editorial comp’s wide feature and two companions. Preserve incumbent light hero and shared chrome; no seed for a pinned structure.',
  'FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md',
].join('\n')

/**
 * Testimonial Component
 * Premium luxury astrology website Testimonial Section.
 * Original open editorial carousel, pagination dots and circular navigation are
 * retained. The extension adds consultation stories and a filterable review
 * collection. Automatic motion stops while the relevant content is being read.
 */
function Testimonial() {
  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const storiesRef = useRef(null)
  const reviewsRef = useRef(null)
  const flipTimeoutRef = useRef(null)
  const reviewTimerRef = useRef(null)
  const visibleReviewsRef = useRef(reviews.slice(0, reviewWindowSize('all')))
  const reducedMotion = useReducedMotion()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [manuallySelected, setManuallySelected] = useState(false)
  const [heroVisible, setHeroVisible] = useState(true)
  const [reviewsVisible, setReviewsVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [filter, setFilter] = useState('all')
  const [visibleReviews, setVisibleReviews] = useState(visibleReviewsRef.current)
  const [flippedReviewId, setFlippedReviewId] = useState(null)
  const autoPlaying = !reducedMotion && !hovered && !focused && !manuallySelected && heroVisible && pageVisible
  const filterLabel = reviewFilters.find(item => item.id === filter).label

  useEffect(() => {
    const root = pageRef.current
    const comment = document.createComment(directionContract)
    root.prepend(comment)
    const header = document.querySelector('header')
    const measure = () => root.style.setProperty('--testimonials-header', (header?.getBoundingClientRect().height || 85) + 'px')
    const resize = new ResizeObserver(measure)
    if (header) resize.observe(header)
    measure()
    const heroObserver = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: .3 })
    heroObserver.observe(heroRef.current)
    const reviewsObserver = new IntersectionObserver(([entry]) => setReviewsVisible(entry.isIntersecting), { threshold: .2 })
    reviewsObserver.observe(reviewsRef.current)
    // Readable at rest; the observer adds only a once-only assembly flourish.
    const storyObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.dataset.revealed = 'true'
        storyObserver.unobserve(entry.target)
      }
    }), { threshold: .12 })
    root.querySelectorAll('.testimonials-story').forEach(story => storyObserver.observe(story))
    const handleVisibility = () => setPageVisible(!document.hidden)
    handleVisibility()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      comment.remove()
      resize.disconnect()
      heroObserver.disconnect()
      reviewsObserver.disconnect()
      storyObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      clearInterval(reviewTimerRef.current)
      clearTimeout(flipTimeoutRef.current)
    }
  }, [])

  // Auto transition: two seconds per review; no timer while offscreen or reading.
  // The loop pauses while the visitor is reading or operating its controls,
  // and manual selection hands control to the visitor for the rest of the visit.
  useEffect(() => {
    if (!autoPlaying) return
    const timer = setInterval(() => setCurrentIndex(index => (index + 1) % featuredReviews.length), 2000)
    return () => clearInterval(timer)
  }, [autoPlaying])

  // Replace one visible review at a time from the selected category. The
  // replacement always comes from outside the current window, so duplicates
  // cannot appear in the grid.
  useEffect(() => {
    clearInterval(reviewTimerRef.current)
    if (reducedMotion || !pageVisible || !reviewsVisible) return
    const pool = getReviewPool(filter)
    reviewTimerRef.current = setInterval(() => {
      const current = visibleReviewsRef.current
      const visibleIds = new Set(current.map(review => review.id))
      const available = pool.filter(review => !visibleIds.has(review.id))
      if (!current.length || !available.length) return
      const slot = Math.floor(Math.random() * current.length)
      const replacement = available[Math.floor(Math.random() * available.length)]
      const next = [...current]
      next[slot] = replacement
      visibleReviewsRef.current = next
      setVisibleReviews(next)
      setFlippedReviewId(replacement.id)
      clearTimeout(flipTimeoutRef.current)
      flipTimeoutRef.current = setTimeout(() => setFlippedReviewId(null), 600)
    }, 2500)
    return () => clearInterval(reviewTimerRef.current)
  }, [filter, pageVisible, reducedMotion, reviewsVisible])

  // Manual navigation handlers preserve the original previous/next/dot behavior.
  const selectReview = index => {
    setManuallySelected(true)
    setCurrentIndex((index + featuredReviews.length) % featuredReviews.length)
  }
  const selectFilter = id => {
    const pool = getReviewPool(id)
    clearInterval(reviewTimerRef.current)
    clearTimeout(flipTimeoutRef.current)
    setFlippedReviewId(null)
    setFilter(id)
    const next = pool.slice(0, reviewWindowSize(id))
    visibleReviewsRef.current = next
    setVisibleReviews(next)
  }
  const exploreStories = event => {
    event.preventDefault()
    storiesRef.current.focus({ preventScroll: true })
    storiesRef.current.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
  }

  return (
    <div className="testimonials-page" ref={pageRef}>
      <section className="testimonials-hero" ref={heroRef} aria-labelledby="testimonials-title">
        {/* DECORATIVE BACKGROUND ELEMENTS — the incumbent zodiac motif. */}
        <div className="testimonials-orbit" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth=".3">
            <circle cx="100" cy="100" r="95" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="75" />
            <circle cx="100" cy="100" r="55" strokeDasharray="2 2" />
            <path d="M100 5v190M5 100h190" />
          </svg>
        </div>
        <div className="testimonials-container testimonials-hero-inner">
          {/* SECTION HEADER */}
          <div className="testimonials-heading">
            <h1 id="testimonials-title">Client Testimonials</h1>
            <p className="testimonials-heading-copy">Experiences shared after personal consultations.</p>
          </div>

          {/* TESTIMONIAL DISPLAY STAGE — no enclosing card; open and spacious. */}
          <div className="testimonials-carousel" role="region" aria-roledescription="carousel" aria-label="Featured testimonials"
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
            onTouchStart={() => setManuallySelected(true)}>
            <div className="testimonials-stage" aria-live={autoPlaying ? 'off' : 'polite'} aria-atomic="true">
              {featuredReviews.map((review, index) => <figure key={review.id}
                className={'testimonials-slide ' + (index === currentIndex ? 'is-active' : '')}
                role="group" aria-roledescription="slide" aria-label={(index + 1) + ' of ' + featuredReviews.length}
                aria-hidden={index !== currentIndex}>
                {/* Client image placeholder: neutral initials, not an invented portrait. */}
                <div className="testimonials-avatar" aria-hidden="true">{review.initials}</div>
                {/* Review text and client information retained from the original carousel. */}
                <blockquote><p>“{review.text}”</p></blockquote>
                <figcaption><strong>{review.name}</strong><span>{review.date} · {review.service}</span></figcaption>
              </figure>)}
            </div>

            {/* INTERACTIVE CONTROLS & NAVIGATION — large targets around small dots. */}
            <div className="testimonials-controls">
              <button type="button" className="testimonials-arrow" onClick={() => selectReview(currentIndex - 1)} aria-label="Previous Testimonial"><ChevronLeft aria-hidden="true" /></button>
              <div className="testimonials-dots">
                {featuredReviews.map((review, index) => <button type="button" key={review.id} onClick={() => selectReview(index)} aria-label={'Go to testimonial ' + (index + 1)} aria-pressed={index === currentIndex} />)}
              </div>
              <button type="button" className="testimonials-arrow" onClick={() => selectReview(currentIndex + 1)} aria-label="Next Testimonial"><ChevronRight aria-hidden="true" /></button>
            </div>
          </div>

          {/* CALL TO ACTION BUTTON — incumbent booking route plus a reading path. */}
          <div className="testimonials-actions">
            <Link to="/booking" className="testimonials-button"><Calendar aria-hidden="true" />Book Appointment</Link>
            <a href="#consultation-stories" onClick={exploreStories} className="testimonials-text-link">Explore the stories <ArrowDown aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      {/* 2. BEHIND THE CONSULTATION */}
      <section className="testimonials-stories" id="consultation-stories" ref={storiesRef} tabIndex={-1} aria-labelledby="stories-title">
        <div className="testimonials-container">
          <div className="testimonials-section-heading">
            <div><h2 id="stories-title">Behind the consultation</h2><p>Different questions. A closer look at the conversation.</p></div>
          </div>
          <div className="testimonials-story-grid">
            {consultationStories.map((story, index) => <article key={story.id} className={'testimonials-story ' + (index === 0 ? 'testimonials-story--featured' : '')} aria-labelledby={'story-' + story.id}>
              <img src={storyArtwork[story.id]} className="testimonials-story-art" alt="" loading="lazy" width="1445" height="1088" />
              <div className="testimonials-story-copy">
                <h3 id={'story-' + story.id}>{story.title}</h3>
                <dl><div><dt>The question</dt><dd>{story.question}</dd></div><div><dt>The conversation</dt><dd>{story.conversation}</dd></div><div><dt>The takeaway</dt><dd>{story.takeaway}</dd></div></dl>
                <div className="testimonials-story-footer"><Link className="testimonials-text-link" to={'/services/' + story.serviceId}>{story.service} <ArrowRight aria-hidden="true" /></Link></div>
              </div>
            </article>)}
          </div>
        </div>
      </section>

      {/* 3. REVIEW COLLECTION — one-at-a-time rotation and populated service filters. */}
      <section ref={reviewsRef} className={'testimonials-reviews ' + (filter !== 'all' ? 'is-filtered' : '')} aria-labelledby="more-voices-title">
        <div className="testimonials-container">
          <div className="testimonials-section-heading">
            <div><h2 id="more-voices-title">More voices, at your pace</h2><p>Browse by consultation, or take your time with the whole collection.</p></div>
          </div>
          <div className="testimonials-filters" role="group" aria-label="Filter reviews by consultation">
            {reviewFilters.map(item => <button type="button" key={item.id} aria-pressed={filter === item.id} aria-controls="testimonials-review-results" onClick={() => selectFilter(item.id)}>{item.label}</button>)}
          </div>
          <p className="testimonials-sr-only" role="status">Showing {visibleReviews.length} of {getReviewPool(filter).length} reviews: {filterLabel}.</p>
          <div id="testimonials-review-results" className={'testimonials-reviews-grid ' + (filter !== 'all' ? 'is-filtered' : '')} aria-live="off">
            {visibleReviews.map(review => <figure className={'testimonials-review-card ' + (review.id === flippedReviewId ? 'is-flipping' : '')} key={review.id} data-review-id={review.id}>
              <div className="testimonials-review-top"><Quote aria-hidden="true" /></div>
              <blockquote><p>“{review.text}”</p></blockquote>
              <figcaption><span className="testimonials-avatar" aria-hidden="true">{review.initials}</span><div><strong>{review.name}</strong><span>{review.service}</span></div></figcaption>
            </figure>)}
          </div>
        </div>
      </section>

      {/* 4. A BRIEF INVITATION — existing destinations; no new booking workflow. */}
      <section className="testimonials-close" aria-labelledby="testimonials-close-title">
        <img className="testimonials-close-landscape" src={closingLandscape} alt="" loading="lazy" width="2120" height="742" />
        <div className="testimonials-container testimonials-close-inner">
          <div><h2 id="testimonials-close-title">What would you like to explore?</h2><p>Find a consultation for the questions on your mind.</p></div>
          <div className="testimonials-actions"><Link to="/services" className="testimonials-button testimonials-button--outline">Explore Services <ArrowRight aria-hidden="true" /></Link><Link to="/booking" className="testimonials-button"><Calendar aria-hidden="true" />Book Consultation</Link></div>
        </div>
      </section>
    </div>
  )
}

export default Testimonial
