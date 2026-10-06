import {BookingLink as Link} from '../lib/BookingProduct.jsx'
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react'
import { publicServiceById } from '../data/publicServices'
import { ServiceArtwork, ServiceFocus, ServiceIcon, ServicePrice } from './ServicePresentation'
import './Service.css'

const service = publicServiceById['name-change']

// A distinct information destination, not a new booking or legal-paperwork flow.
export default function NameChangeService() {
  return <div className="name-change-page">
    <section className="name-change-intro services-container">
      <Link className="name-change-back" to="/services"><ArrowLeft aria-hidden="true" />All Services</Link>
      <div className="name-change-hero">
        <div>
          <h1>Name Change Consultation</h1>
          <p className="service-description">A name is personal. If you’re considering a new spelling or a different name, explore it through numerology—with room to discuss what feels right to you.</p>
          <ServiceFocus service={service} />
          <div className="service-bottom">
            <ServicePrice service={service} />
            <Link to="/booking?service=name-change" className="service-button service-button--gold"><Calendar aria-hidden="true" />Book Now</Link>
          </div>
        </div>
        <ServiceArtwork service={service} eager />
      </div>
    </section>

    <section className="name-change-explore services-container" aria-labelledby="name-change-explore-title">
      <div>
        <h2 id="name-change-explore-title">What we can explore</h2>
        <ul className="name-change-topics">
          <li><ServiceIcon name="name" /><div><h3>Your current name</h3><p>The name you use and how its spelling is interpreted in numerology.</p></div></li>
          <li><ServiceIcon name="numbers" /><div><h3>The numbers behind it</h3><p>Name numbers considered alongside your date of birth.</p></div></li>
          <li><ServiceIcon name="path" /><div><h3>Possible alternatives</h3><p>Different spellings or names you’d like to discuss before making a choice.</p></div></li>
        </ul>
      </div>
      <aside className="name-change-prepare">
        <h2>Bring to the conversation</h2>
        <ul><li>Your current full name and date of birth.</li><li>Any alternative names or spellings you’re considering.</li><li>What you’d like to understand about a name change.</li></ul>
        <p>This is numerology guidance, not a legal name-change paperwork service.</p>
      </aside>
    </section>

    <section className="services-help">
      <div className="services-container services-help-inner">
        <div><h2>Want to compare possible names?</h2><p>Bring the spellings you are considering and discuss them together.</p></div>
        <Link className="service-button service-button--gold" to="/booking?service=name-change"><Calendar aria-hidden="true" />Book an Appointment</Link>
      </div>
    </section>

    <section className="name-change-related">
      <div className="services-container services-help-inner">
        <div><h2>Looking beyond your name?</h2><p>General Numerology explores your core numbers and life path more broadly.</p></div>
        <div className="service-actions"><Link className="service-button service-button--outline" to="/services/numerology">General Numerology<ArrowRight aria-hidden="true" /></Link><Link className="service-button service-button--gold" to="/booking?service=name-change"><Calendar aria-hidden="true" />Book Now</Link></div>
      </div>
    </section>
  </div>
}
