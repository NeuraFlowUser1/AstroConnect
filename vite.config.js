import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {surfaceManifestPlugin} from './appointment-system/tools/build/surfaces.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), surfaceManifestPlugin({bookingModules:['src/Component/Appointment_Booking.jsx','src/Component/BookingReceipt.jsx','src/Component/BookingAccess.jsx','src/lib/bookingBrowser.mjs']})],
})
