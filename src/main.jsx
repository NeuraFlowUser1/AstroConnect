import {productState} from './lib/productState.js';
import {startWhenBookingOn} from '../appointment-system/browser/conditional-work.mjs';
import {StrictMode} from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {BookingStateProvider} from './lib/BookingProduct.jsx';
import './index.css';
import App from './App.jsx';

if(window.location.hash.startsWith('#/')&&!window.location.hash.startsWith('#//')){
 const destination=new URL(window.location.hash.slice(1),window.location.origin);
 if(destination.origin===window.location.origin)window.history.replaceState(null,'',destination.pathname+destination.search+destination.hash);
}
const container=document.getElementById('root');
const app=<StrictMode><BookingStateProvider controller={productState}><BrowserRouter><App/></BrowserRouter></BookingStateProvider></StrictMode>;
const generated=container.dataset.publicPath===window.location.pathname&&container.dataset.publicHtml==='1';
if(generated)hydrateRoot(container,app,{identifierPrefix:'astroadvice-',onRecoverableError:error=>console.error('Public page attachment failed.',error)});
else createRoot(container).render(app);
// One document lifetime. Public navigation updates this same controller's profile.
const stopState=productState.start(window,document,{profile:window.location.pathname.startsWith('/booking')?'active':'public'});
const stopRecovery=startWhenBookingOn(()=>import('./lib/bookingBrowser.mjs').then(({bookingBrowser})=>()=>bookingBrowser.recovery.start()),{state:productState});
if(import.meta.hot)import.meta.hot.dispose(()=>{stopRecovery?.();stopState();});
