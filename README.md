> **Current booking release — 8 October 2026:** use [the current operating guide](docs/appointment-system-release.md).
> Complete package `97ab5d49fc559eb1acdeb7157d4561134d1bad824cca298506f48b2a9d32b49d`:573 files,36 unchanged migrations. The bounded email-feedback correction is locally qualified and ready for coordinated publication. Production is still the accepted parent until its release identity is independently read back.
> Fresh Vedic Astrology no-email paid acceptance passes:₹1 captured, confirmed booking, Meet link, parsed PDF, staff notification, both spreadsheets and one requested company-inbox copy. Normal price is restored to₹2,100; other settings remain.
> The shared email-feedback correction passes93/93 focused checks. Full parent evidence remains verified for unchanged code, with current whole-code coverage above90% and no exclusions. Both builds and contained hosting checks pass. No fresh full-suite or backup-run claim is made for this correction.
> Five private pages are internally linked with existing permissions. Company passwords remain encrypted outside source. Keep the existing accounts, keys and saved choices. Broader website tests and visible note history remain deferred.
> The imported README below is dated reference; use the current guide for operation.

# 🌌 AstroConnect - Astrologer Website & Booking Engine

> **Start here — Plan 1, updated 2026-09-10:** [Reliable Booking, Inquiries and Client Calendar: From Setup to Handover](docs/PLAN-001-booking-inquiries-and-client-calendar.md) is a historical execution checklist, superseded by `docs/appointment-system-release.md`. Read its **Resume here** section after any context reset. The website is `astroadvicebykundansingh.com`; the user confirms access to its Vercel hosting account. The booking foundation/private calendar are implemented and previously tested locally, but live checkout remains disabled. All existing records are confirmed dummy. Supporting references are [the requirement/history record](BOOKING_ROADMAP.md), backend runbook (historical path `src/backend/README.md`) and [previous verification](BOOKING_FOUNDATION_REVIEW.md). The inherited overview and setup instructions below are historical, not the active backend; do not use their legacy SMTP, JSON, Jitsi or service-account instructions for new setup.

A modern, full-stack astrology consultation platform that combines an elegant React frontend with a powerful Python backend, designed to manage appointments, customer queries, and video consultations.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**AstroConnect** is a comprehensive astrology consultation platform built for professional astrologers to manage:

- **Customer Inquiries**: Unified intake forms for general consultations and specialized Prashna Kundali (horary astrology) readings
- **Appointment Booking**: Double-booking protected calendar system with real-time availability checking
- **Video Consultations**: Integrated Jitsi Meet for secure, private video sessions
- **Email Notifications**: Automated alerts to both clients and astrologers with meeting details
- **Premium UI/UX**: Celestial-themed glassmorphic design with smooth animations

The platform bridges the gap between traditional astrology services and modern digital convenience, enabling astrologers to scale their practice without losing the personal touch.

---

## ✨ Features

### 1. **Multi-Channel Query Intake**
- **Home Page Contact Form**: Quick general inquiries with name, phone, and message
- **Dedicated Contact Page**: Detailed consultation request with service selection
- **Prashna Kundali Form**: Specialized intake for horary astrology readings with specific question details
- All queries are logged to a unified database (`local_queries.json`) with timestamps

### 2. **Intelligent Booking Engine**
- **Interactive Calendar Interface**: Visual date and time slot selection
- **Real-Time Availability**: Backend queries Google Calendar API to fetch live booking status
- **Double-Booking Protection**: Prevents overbooking with configurable slot limits (default: 2 bookings/hour)
- **IST Timezone Support**: Automatically handles India Standard Time conversions
- **Dynamic Jitsi Meet Rooms**: Generates unique meeting links for each booking

### 3. **Email Notification System**
- Automated SMTP emails sent to `astroadvicebyks@gmail.com` with:
  - Client details (name, phone, query type)
  - Booking confirmation with time slot
  - Unique Jitsi Meet video room link
  - Custom message from the client
- TLS-encrypted Gmail App Password authentication for security

### 4. **Google Calendar Integration**
- Dual-calendar system:
  - **Main Calendar**: Astrologer's personal availability/schedule
  - **Bookings Calendar**: Client appointment records (read-only access for audit trail)
- Real-time sync with Google Calendar API v3
- Timezone-aware event creation and querying

### 5. **Premium Visual Design**
- **Dark Celestial Theme**: Deep purples, rich golds, and warm ivories
- **Glassmorphic UI**: Frosted glass effect cards with subtle blur
- **Responsive Layout**: Mobile-first design optimized for all devices
- **Framer Motion Animations**: Smooth transitions and interactive elements
- **Accessibility**: Semantic HTML, contrast-compliant colors

### 6. **Service Showcase**
- **Services Page**: Display available consultation packages with descriptions
- **Service Details Page**: In-depth information for specialized services
- **Booking Integration**: Direct path to book appointments for each service

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|-----------|---------|
| **React 19** | Component-based UI library |
| **Vite 8** | Fast build tool & dev server |
| **React Router DOM v7** | Client-side routing & navigation |
| **Tailwind CSS v4** | Utility-first styling framework |
| **Framer Motion** | Advanced animations & transitions |
| **Lucide React & React Icons** | Icon libraries |

### **Backend**
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Modern, high-performance Python web framework |
| **Uvicorn** | ASGI web server |
| **Pydantic** | Data validation with Python type hints |
| **google-api-python-client** | Google Calendar API integration |
| **email-validator** | Email validation library |

### **External Services**
| Service | Integration |
|---------|-----------|
| **Google Calendar API v3** | Appointment storage & availability |
| **Gmail SMTP** | Email notifications |
| **Jitsi Meet** | Video consultation rooms |
| **Vercel** | Frontend deployment (CI/CD ready) |

---

## 📂 Project Structure

```
AstroConnect/
├── src/                              # Frontend React Source Code
│   ├── assets/                       # Images, logos, planet graphics
│   ├── components/                   # UI Components
│   │   ├── Navbar.jsx                # Navigation bar
│   │   ├── Footer.jsx                # Footer with contact info
│   │   ├── Home.jsx                  # Landing page & contact form
│   │   ├── Contact.jsx               # Contact page
│   │   ├── Services.jsx              # Services showcase
│   │   ├── ServiceDetail.jsx         # Service details & intake forms
│   │   └── Appointment_Booking.jsx   # Calendar booking interface
│   ├── App.jsx                       # Main app component & routing
│   └── main.jsx                      # React DOM entry point
│
├── src/backend/                      # FastAPI Backend
│   ├── main.py                       # API routes & business logic
│   ├── .env                          # Environment variables (not tracked)
│   ├── service_account.json          # Google Cloud credentials (not tracked)
│   ├── calendar_config.json          # Calendar ID mapping (not tracked)
│   └── local_queries.json            # Customer query database (not tracked)
│
├── public/                           # Static assets
├── dist/                             # Production build output
├── .gitignore                        # Git ignore rules (secures credentials)
├── package.json                      # Node dependencies
├── package-lock.json                 # Dependency lock file
├── vite.config.js                    # Vite build configuration
├── .oxlintrc.json                    # Linter configuration
├── vercel.json                       # Vercel deployment config
├── architecture.md                   # Technical architecture docs
├── Design.md                         # Design system & UI guidelines
├── DEVELOPER_RULES.md                # Development guidelines
└── README.md                         # This file
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+
- **Google Cloud Project** with Calendar API enabled
- **Gmail account** with App Password configured

### Step 1: Clone the Repository
```bash
git clone https://github.com/Prabhakar407/AstroConnect.git
cd AstroConnect
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Set Up Backend Environment

Create a Python virtual environment:
```bash
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

Install Python dependencies:
```bash
pip install fastapi uvicorn google-api-python-client google-auth-httplib2 google-auth-oauthlib pydantic email-validator python-multipart
```

### Step 4: Configure Environment Variables

Create `src/backend/.env`:
```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
GMAIL_ADDRESS=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# Google Calendar
GOOGLE_CALENDAR_EMAIL=astroadvicebyks@gmail.com

# Booking Limits
MAX_BOOKINGS_PER_HOUR=2

# Jitsi Configuration
JITSI_DOMAIN=meet.jit.si
```

### Step 5: Set Up Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Google Calendar API**
4. Create a **Service Account** and download the JSON key
5. Save as `src/backend/service_account.json` (ignored by Git)
6. Share your calendar with the service account email

---

## ⚙️ Configuration

### Environment Variables (`src/backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_SERVER` | Mail server host | `smtp.gmail.com` |
| `SMTP_PORT` | Mail server port | `587` |
| `GMAIL_ADDRESS` | Sender email | `astroadvice@gmail.com` |
| `GMAIL_APP_PASSWORD` | Gmail App Password (16 chars) | `xxxx xxxx xxxx xxxx` |
| `GOOGLE_CALENDAR_EMAIL` | Astrologer's calendar email | `astroadvicebyks@gmail.com` |
| `MAX_BOOKINGS_PER_HOUR` | Max concurrent bookings | `2` |
| `JITSI_DOMAIN` | Jitsi Meet domain | `meet.jit.si` |

### Tailwind CSS Configuration

The project uses Tailwind CSS v4 with a zero-config approach:
- Import via `@import "tailwindcss";` in CSS entry points
- Custom colors defined via CSS variables (see `Design.md` for palette)
- No `tailwind.config.js` needed for standard configuration

---

## 📖 Usage

### Development Mode

**Terminal 1 - Frontend:**
```bash
npm run dev
# Opens at http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd src/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
# API available at http://localhost:8000
```

### Production Build

```bash
npm run build
# Creates optimized bundle in dist/
npm run preview
# Serves production build locally
```

### Linting

```bash
npm run lint
# Runs Oxlint static analysis
```

---

## 🔌 API Endpoints

### Query Submission Endpoints

#### POST `/api/contact`
Submit a general contact/consultation inquiry.

**Request Body:**
```json
{
  "name": "Client Name",
  "phone": "+91-9876543210",
  "email": "client@email.com",
  "message": "I would like to book a consultation..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Query submitted successfully",
  "query_id": "unique-id-timestamp"
}
```

#### POST `/api/prashna`
Submit a specialized Prashna Kundali (horary astrology) query.

**Request Body:**
```json
{
  "name": "Client Name",
  "phone": "+91-9876543210",
  "email": "client@email.com",
  "question": "Will I get the job I applied for?",
  "question_time": "2024-09-04T14:30:00+05:30",
  "location": "City, State"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prashna query submitted",
  "query_id": "unique-id-timestamp"
}
```

### Booking Endpoints

#### GET `/api/availability?date=YYYY-MM-DD`
Fetch available time slots for a specific date.

**Query Parameters:**
- `date` (string, required): Date in ISO format (YYYY-MM-DD)

**Response:**
```json
{
  "date": "2024-09-04",
  "slots": [
    {
      "time": "10:00",
      "available": true,
      "bookings_count": 0
    },
    {
      "time": "11:00",
      "available": false,
      "bookings_count": 2
    }
  ]
}
```

#### POST `/api/book-appointment`
Create a new appointment booking.

**Request Body:**
```json
{
  "name": "Client Name",
  "phone": "+91-9876543210",
  "email": "client@email.com",
  "date": "2024-09-04",
  "time": "10:00",
  "service": "Vedic Astrology Reading"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "booking_id": "booking-uuid",
  "jitsi_room_url": "https://meet.jit.si/AstroConnect_2024090410",
  "calendar_event_id": "google-calendar-event-id"
}
```

---

## 🔒 Security

### Protected Credentials
The `.gitignore` file secures sensitive data:

| File | Contains | Status |
|------|----------|--------|
| `.env` | SMTP passwords, API keys | ❌ Not tracked |
| `service_account.json` | Google Cloud credentials | ❌ Not tracked |
| `calendar_config.json` | Active Calendar IDs | ❌ Not tracked |
| `local_queries.json` | Customer phone numbers, emails | ❌ Not tracked |

### Best Practices

✅ **Do's:**
- Store all secrets in environment variables
- Use Google Calendar's read-only access for client records
- Enable 2-factor authentication on deployment services
- Regularly rotate API keys and app passwords
- Use HTTPS for all deployments

❌ **Don'ts:**
- Commit `.env`, credentials, or private keys to Git
- Hardcode passwords or API keys in code
- Share `service_account.json` publicly
- Expose customer database to unauthorized users

### Data Privacy
- All customer queries and bookings are stored locally
- No third-party tracking or analytics on sensitive data
- Calendar data shared with read-only permissions to the astrologer
- Video sessions are peer-to-peer via Jitsi (not stored on servers)

---

## 🤝 Contributing

When contributing to this project, follow the guidelines in `DEVELOPER_RULES.md`:

1. **No Unauthorized Edits**: Discuss changes before implementing
2. **Code Comments**: Maintain clear, structural documentation
3. **Dependency Verification**: Only use packages in `package.json`
4. **Security First**: Never commit credentials or private data
5. **Build Verification**: Run `npm run build` before submitting changes
6. **Style Consistency**: Follow Tailwind CSS v4 and design system guidelines

---

## 📚 Documentation

- **[Architecture Documentation](./architecture.md)** - Technical system design, data flow, and integrations
- **[Design System](./Design.md)** - Color palette, typography, animations, and UI components
- **[Developer Guidelines](./DEVELOPER_RULES.md)** - Coding standards and project rules

---

## 📞 Support & Contact

- **Email**: astroadvicebyks@gmail.com
- **GitHub Issues**: [Report bugs and request features](https://github.com/Prabhakar407/AstroConnect/issues)

---

## 📄 License

This project is currently unlicensed. For licensing inquiries, please contact the repository owner.

---

## 🙏 Acknowledgments

- Built with ❤️ for modern astrology consultations
- Inspired by celestial design patterns and responsive web principles
- Powered by the amazing open-source community

---

**Last Updated**: September 4, 2024  
**Maintainer**: [Prabhakar407](https://github.com/Prabhakar407)
