import {BookingOnly,BookingCopy} from '../lib/BookingProduct.jsx';
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Lock, Eye, Database, AlertCircle, CheckCircle2, Scale, Clock } from 'lucide-react'
import './LegalPage.css'

const policies = [
  { id: 'privacy', path: '/privacy-policy', title: 'Privacy Policy' },
  { id: 'terms', path: '/terms-and-conditions', title: 'Terms & Conditions' },
  { id: 'refund', path: '/refund-policy', title: 'Refund & Cancellation Policy' },
]

export default function LegalPage({ policy }) {
  const current = policies.find(item => item.id === policy)
  useEffect(() => {
    const previous = document.title
    document.title = current.title + ' | Astro Advice by Kundan Singh'
    return () => { document.title = previous }
  }, [current.title])

  return (
    <article className="legal-page">
      <div className="legal-page-inner">
        <header className="legal-page-header">
          <p className="legal-page-eyebrow">Astro Advice by Kundan Singh</p>
          <h1>{current.title}</h1>
          <nav aria-label="Policies">
            {policies.map(item => <NavLink key={item.id} to={item.path}>{item.title}</NavLink>)}
          </nav>
        </header>
        <div className="legal-page-content">
            {/* ========================================================= */}
            {/* TAB 1: PRIVACY POLICY                                    */}
            {/* ========================================================= */}
            {policy === 'privacy' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#D3AF54]/25 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#D3AF54] tracking-wider block">
                    Our Sacred Commitment
                  </span>
                  <p className="text-white/90">
                    At <strong>Astroadvice by Kundan Singh</strong> (Vasant Kunj, New Delhi), we hold your personal credentials, birth details, and horary questions with the utmost sanctity and confidentiality.
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54] flex items-center gap-2">
                    <Database size={16} />
                    <span>1. Information We Collect</span>
                  </h2>
                  <p className="text-slate-300">
                    To compute accurate astrological charts (Kundali), planetary dashas, and schedule readings, we collect:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li><strong>Personal Contact Data:</strong> Full Name, Email Address, and Phone/WhatsApp Number.</li>
                    <li><strong>Birth Credentials:</strong> Exact Date of Birth, Time of Birth, and Place of Birth (City/State/Country).</li>
                    <li><strong>Consultation Inquiries:</strong> Specific questions submitted for Horary Astrology (Prashna Kundali), Vastu layouts, or Numerology.</li>
                    <li><strong>Verification Data:</strong> Email verification status and security records used to protect forms and prevent misuse.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54] flex items-center gap-2">
                    <Lock size={16} />
                    <span>2. Confidentiality & Service Providers</span>
                  </h2>
                  <div className="p-3.5 rounded-xl bg-[#D3AF54]/10 border border-[#D3AF54]/30 text-white space-y-1">
                    <p className="font-semibold text-[#ECCF86]">
                      We do not sell or rent your personal information or birth charts, or use them for advertising.
                    </p>
                    <p className="text-xs text-slate-300">
                      We treat consultation details as confidential. Providers that host the website, store records and deliver messages process the information needed to provide those services. These include Vercel, Neon, Resend and Cloudflare. We may also disclose information when required by law.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54] flex items-center gap-2">
                    <Eye size={16} />
                    <span>3. How Your Information Is Used</span>
                  </h2>
                  <p className="text-slate-300">
                    <BookingCopy off="Your details are used to respond to enquiries and provide consultations arranged directly with the practice. Information from existing appointments is retained as needed to complete those services and handle support requests.">Your details are used solely for: (a) casting planetary positions and analyzing astrological charts; (b) scheduling your consultation session; (c) responding to inquiries; and (d) sending verification codes, consultation updates and Google Meet links.</BookingCopy>
                  </p>
                </div>

                <BookingOnly><section className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54]">4. Google Account & Calendar Connection</h2>
                  <p>The studio owner can sign in with Google and separately choose to connect their calendar. We use their Google account identifier and verified email to restrict access to the private studio page. With permission, the calendar connection reads calendar settings and supports creating, checking and cancelling consultation events and Google Meet links on the connected calendar. It does not import personal calendar appointments into the website.</p>
                  <p>Connection credentials are stored on our server, with the long-lived Google access credential encrypted. Calendar identifiers, appointment references and meeting links are kept with the records needed to operate the service. When appointment invitations are sent, the participants receive the relevant appointment details through Google and our email provider; birth details and private consultation notes are not included in calendar event descriptions.</p>
                  <p>Google account and calendar data are not sold or used for advertising. Access is limited to providing and supporting this connection, security and legal obligations. You can withdraw access through <a href="https://myaccount.google.com/connections" target="_blank" rel="noopener noreferrer">your Google Account connections</a> and contact us to request deletion of stored connection data. Withdrawing access stops future access but does not itself delete existing calendar events or records.</p>
                  <p>We retain information for the purposes described here, including service delivery, security and applicable record-keeping requirements. Contact us to request access, correction or deletion; any records that must be retained will be explained when handling your request.</p>
                </section></BookingOnly>

                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54]">
                    5. Grievance & Data Inquiries
                  </h2>
                  <p className="text-slate-300">
                    To request correction or deletion of your birth records, contact our studio:
                  </p>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 text-xs">
                    <p>📧 Email: <a href="mailto:astroadvicebyks@gmail.com" className="text-[#D3AF54] hover:underline">astroadvicebyks@gmail.com</a></p>
                    <p>📞 Phone: <a href="tel:+918130808758" className="text-[#D3AF54] hover:underline">+91 8130808758</a> / <a href="tel:+918527790801" className="text-[#D3AF54] hover:underline">+91 8527790801</a></p>
                    <p>📍 Studio: B-23 Shantikunj, B-Block, Avenue-9, Church Road, Vasant Kunj, New Delhi-110070</p>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: TERMS & CONDITIONS                                */}
            {/* ========================================================= */}
            {policy === 'terms' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54] flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>1. Acceptance of Terms</span>
                  </h2>
                  <p className="text-slate-300">
                    By booking a session, submitting an inquiry, or consulting with <strong>Astrologer Kundan Singh</strong>, you confirm you are at least 18 years of age and agree to these terms.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#D3AF54]/10 border border-[#D3AF54]/30 space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#ECCF86] flex items-center gap-2">
                    <AlertCircle size={18} />
                    <span>2. Astrological Advisory Disclaimer</span>
                  </h2>
                  <p className="text-white text-xs sm:text-sm">
                    Vedic Astrology, Numerology, Prashna Kundali, Laal Kitaab Remedies, and Vastu Shastra are traditional spiritual sciences based on symbolic interpretation and planetary cycles.
                  </p>
                  <p className="text-[#ECCF86] text-xs font-semibold">
                    ✦ Consultations are intended solely for personal guidance and spiritual insight. They do NOT substitute for licensed medical treatment, legal representation, or certified financial advisory.
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54]">
                    3. Client Responsibility for Birth Data
                  </h2>
                  <p className="text-slate-300">
                    Planetary calculations (Lagna, Navamsha, and Dashas) depend on exact minutes. The client assumes responsibility for providing accurate Date, Time, and Place of Birth. Astroadvice is not liable for misinterpretations resulting from incorrect client-supplied birth credentials.
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54] flex items-center gap-2">
                    <Clock size={16} />
                    <span>4. Studio Schedule & Timings</span>
                  </h2>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li><strong>Working Days:</strong> Monday to Saturday (Sundays Closed).</li>
                    <li><strong>Operating Windows:</strong> 10:00 AM - 12:00 PM & 3:00 PM - 6:00 PM IST.</li>
                    <li><strong>Modes:</strong> Online video consultations (Google Meet) or In-person sessions at our Vasant Kunj Studio by prior appointment.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54] flex items-center gap-2">
                    <Scale size={16} />
                    <span>5. Governing Law</span>
                  </h2>
                  <p className="text-slate-300">
                    These Terms are governed by the laws of India. Any disputes shall be subject exclusively to the jurisdiction of the courts in New Delhi, India.
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: REFUND POLICY                                     */}
            {/* ========================================================= */}
            {policy === 'refund' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54] flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>1. Nature of Advisory Services</span>
                  </h2>
                  <p className="text-slate-300">
                    Consultations involve dedicated mathematical chart calculations, planetary transit analysis, and scheduled professional time reserved exclusively for you.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                      ✓ 100% Full Refund
                    </span>
                    <p className="text-xs text-slate-300">
                      Cancellations made with at least <strong>24 hours advance notice</strong> prior to your scheduled consultation slot.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[#D3AF54]/40 bg-[#D3AF54]/10 space-y-1">
                    <span className="text-xs font-bold text-[#ECCF86] uppercase tracking-wider block">
                      ✦ Free Rescheduling
                    </span>
                    <p className="text-xs text-slate-300">
                      You may reschedule your session up to <strong>12 hours prior</strong> at zero extra charge by calling our helpline.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54]">
                    2. Non-Refundable Scenarios
                  </h2>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li><strong>Completed Consultations:</strong> Once a live reading session has taken place, fees are non-refundable.</li>
                    <li><strong>Delivered Prashna Answers:</strong> Horary Prashna charts that have already been cast and dispatched via email/WhatsApp cannot be refunded.</li>
                    <li><strong>Last-Minute Cancellations (Under 12 Hours):</strong> Eligible for a one-time complimentary reschedule within 14 days rather than a cash refund.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif font-bold text-base text-[#D3AF54] flex items-center gap-2">
                    <Clock size={16} />
                    <span>3. Refund Processing Timeline</span>
                  </h2>
                  <p className="text-slate-300">
                    Approved refunds are credited directly back to the original payment source (UPI, Bank Account, Card) within <strong>5 to 7 business days</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1 text-xs">
                  <p className="font-bold text-[#D3AF54]">Rescheduling & Billing Helpline:</p>
                  <p>📞 Call for cancellations or rescheduling: <a href="tel:+918527790801" className="text-white font-bold hover:underline">+91 8527790801</a></p>
                  <p>📧 Email: <a href="mailto:astroadvicebyks@gmail.com" className="text-white hover:underline">astroadvicebyks@gmail.com</a></p>
                </div>
              </div>
            )}

        </div>
      </div>
    </article>
  )
}

