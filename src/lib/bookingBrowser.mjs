import {createBookingBrowser} from '../../appointment-system/browser/booking/index.mjs';
import profile from '../../appointment-settings/booking-browser.json';
import {productState} from './productState.js';
export const bookingBrowser=createBookingBrowser(profile,{product:productState});
