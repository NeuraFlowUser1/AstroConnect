import {lazy} from 'react';
import {Route} from 'react-router-dom';
import PublicApp from './PublicApp.jsx';
import {BookingRoute} from './lib/BookingProduct.jsx';
const AppointmentBooking=lazy(()=>import('./Component/Appointment_Booking.jsx'));
const BookingReceipt=lazy(()=>import('./Component/BookingReceipt.jsx'));
const BookingAccess=lazy(()=>import('./Component/BookingAccess.jsx'));
export default function App(){
 return <PublicApp utilityRoutes={<>
  <Route path="/booking" element={<BookingRoute><AppointmentBooking/></BookingRoute>}/>
  <Route path="/booking/access" element={<BookingRoute><BookingAccess/></BookingRoute>}/>
  <Route path="/booking/receipt" element={<BookingRoute><BookingReceipt/></BookingRoute>}/>
  <Route path="/booking-help" element={<BookingRoute><BookingAccess/></BookingRoute>}/>
 </>}/>;
}
