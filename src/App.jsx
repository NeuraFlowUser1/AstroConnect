// AstroAdvice Client Routing Engine
import { useEffect,lazy,Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './Component/Navbar'
import Home from './Component/Home'
import About from './Component/About'
import ServiceDetail from './Component/ServiceDetail'
import Service from './Component/Service'
import Testimonial from './Component/Testimonial'
import Contact from './Component/Contact'
const Appointment_Booking=lazy(()=>import('./Component/Appointment_Booking.jsx'));

import Footer from './Component/Footer'
import LegalPage from './Component/LegalPage'
import NotFound from './Component/NotFound'
import {ProductNavigationCheck,BookingRoute} from './lib/BookingProduct.jsx'

const BookingReceipt=lazy(()=>import('./Component/BookingReceipt.jsx'));
const BookingAccess=lazy(()=>import('./Component/BookingAccess.jsx'));
import './App.css'

/**
 * ScrollToTop Component
 * Resets window scroll position to (0, 0) upon route navigation transitions.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * App Component
 * Root component that defines the routing layout and links components.
 */
function App() {
  return (
    <Router>
      <ScrollToTop /><ProductNavigationCheck />
      {/* Set app background to luxury brand Warm Ivory (#FDF9F7) and body text to Plum (#55393F) */}
      <div className="min-h-screen bg-[#090b1c] text-[#EBDCD4] flex flex-col font-sans">
        
        {/* Navigation Section */}
        <Navbar />

        {/* Dynamic Route Content Section */}
        <main className="flex-grow">
          <Suspense fallback={<p role="status">Loading the page…</p>}><Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Service />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/testimonials" element={<Testimonial />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<BookingRoute><Appointment_Booking /></BookingRoute>} />
            <Route path="/booking/access" element={<BookingRoute><BookingAccess/></BookingRoute>}/>
            <Route path="/booking/receipt" element={<BookingRoute><BookingReceipt/></BookingRoute>}/>
            <Route path="/booking-help" element={<BookingRoute><BookingAccess/></BookingRoute>}/>
            <Route path="/privacy-policy" element={<LegalPage policy="privacy" />} />
            <Route path="/terms-and-conditions" element={<LegalPage policy="terms" />} />
            <Route path="/refund-policy" element={<LegalPage policy="refund" />} />
            <Route path="*" element={<NotFound />} />
          </Routes></Suspense>
        </main>

        {/* Global Luxury Footer Section */}
        <Footer />

      </div>
    </Router>
  )
}

export default App
