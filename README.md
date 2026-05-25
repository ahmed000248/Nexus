# Nexus – Investor & Entrepreneur Collaboration Platform

Nexus is a modern collaboration platform designed to connect investors and entrepreneurs through meetings, communication tools, secure document handling, and deal management inside a professional dashboard environment.

This project was enhanced as part of an Advanced Frontend Internship Task using React.

---

# Features

## Week 1 Features

- Responsive dashboard UI improvements
- Consistent theme and styling
- Meeting Scheduling Calendar
- Add/Edit/Delete meeting slots
- Meeting request system
- Accept/Decline meeting requests
- Upcoming meetings dashboard section

---

## Week 2 Features

- Video Calling UI using WebRTC browser APIs
- Start/End call functionality
- Video and audio toggle controls
- Screen sharing support (optional)
- Document Processing Chamber
- Upload and preview PDFs/docs
- E-signature mockup using signature pad
- Contract status tracking:
  - Draft
  - In Review
  - Signed

---

## Week 3 Features

### Payment Section

- Wallet balance dashboard
- Mock Deposit functionality
- Mock Withdraw functionality
- Mock Transfer functionality
- Transaction history table
- Funding deal simulation (Investor → Entrepreneur)
- Payment UI inspired by Stripe/PayPal

### Security & Access Control

- Password strength meter
- Multi-step login UI
- OTP / 2FA verification mockup
- Role-based dashboards:
  - Investor Dashboard
  - Entrepreneur Dashboard

- Protected frontend routes

### Final Integration & UX Improvements

- All modules connected through dashboard navigation
- Guided walkthrough using onboarding tooltips
- Improved responsive design across devices
- Better sidebar and navigation flow
- Final dashboard polishing and UI refinements

---

# Tech Stack

- React.js
- Vite
- React Router
- FullCalendar
- WebRTC Browser APIs
- React Signature Canvas
- CSS / Responsive Design

---

# Project Structure

src/
├── components/
├── pages/
├── features/
│ ├── meetings/
│ ├── videoCall/
│ ├── documentChamber/
│ ├── payments/
│ └── security/
├── assets/
├── routes/
└── styles/

---

# Installation

Clone the repository:

```bash id="17e73e"
git clone <your-repository-link>
```

Move into project folder:

```bash id="62qhx0"
cd nexus-internship
```

Install dependencies:

```bash id="t06ih6"
npm install
```

Run development server:

```bash id="f4y8ol"
npm run dev
```

---

# Build Project

```bash id="u4fm86"
npm run build
```

---

# Main Functionalities

## Meeting Scheduling

Users can:

- Create meeting slots
- Edit meetings
- Delete meetings
- Accept/Decline requests
- View confirmed meetings on dashboard

---

## Video Calling

Users can:

- Start video calls
- End calls
- Toggle microphone
- Toggle camera
- Share screen (optional)

---

## Document Chamber

Users can:

- Upload contracts/documents
- Preview uploaded files
- Sign documents using digital signature pad
- Track document approval status

---

## Payment System

Users can:

- View wallet balance
- Simulate deposits and withdrawals
- Transfer funds
- View transaction history
- Simulate investment funding flow

---

## Security Features

Users can:

- Login using multi-step authentication
- Verify OTP codes
- Access role-based dashboards
- Check password strength during signup

---

# UI Features

- Fully responsive design
- Modern SaaS dashboard interface
- Professional investor platform styling
- Responsive sidebar/navigation
- Dashboard analytics cards
- Clean card layouts with soft shadows
- Mobile and tablet support

---

# Deployment

Frontend deployed using Vercel.

---

# Internship Task

This project was completed as part of an Advanced Frontend Internship assignment focused on enhancing an existing React-based collaboration platform with modern collaboration, communication, payment, and security features.

---

# Future Improvements

- Real-time WebRTC calling
- Backend integration
- Database support
- Real payment gateway integration
- Cloud document storage
- Real authentication and authorization
- Notifications system
- Real-time chat system
- AI-powered investor recommendations
