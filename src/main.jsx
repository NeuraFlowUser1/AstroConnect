import {productState} from './lib/productState.js';
import {startWhenBookingOn} from '../appointment-system/browser/conditional-work.mjs';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Preserve existing shared links and the Google return URL when moving to clean paths.
// Never treat a protocol-relative hash as a destination on another website.
if (window.location.hash.startsWith('#/') && !window.location.hash.startsWith('#//')) {
  const destination = new URL(window.location.hash.slice(1), window.location.origin)
  if (destination.origin === window.location.origin) {
    window.history.replaceState(null, '', destination.pathname + destination.search + destination.hash)
  }
}

async function mountWebsite(){
// State is proved before any booking component mounts; failure starts safely off.
await productState.refresh({force:true});
productState.start();
startWhenBookingOn(productState,()=>import('./lib/bookingBrowser.mjs').then(module=>module.bookingBrowser.recovery));
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
}
mountWebsite();
