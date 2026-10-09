/** Demo content aligned to Curevanta Healthcare App Showcase */
export const brand = {
  name: "Curevanta",
  tagline: "Care. Closer to You.",
  subline: "Reliable Healthcare At Your Doorstep",
};

export const patientDemo = {
  name: "Priya",
  fullName: "Priya Sharma",
  phone: "+91 98765 43210",
  location: "Indiranagar, Bengaluru",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
};

export const services = [
  {
    id: "doctor-home",
    title: "Doctor at Home",
    description: "Verified doctors for consultation at your doorstep",
    category: "Doctor",
    icon: "Stethoscope",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop",
  },
  {
    id: "nurse-home",
    title: "Nurse at Home",
    description: "Trained nurses for injections, wound care & vitals",
    category: "Nursing",
    icon: "HeartPulse",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=160&h=160&fit=crop",
  },
  {
    id: "diagnostics",
    title: "Diagnostics at Home",
    description: "Sample collection and reports without leaving home",
    category: "Diagnostics",
    icon: "FlaskConical",
    image:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=160&h=160&fit=crop",
  },
  {
    id: "physio",
    title: "Physiotherapy",
    description: "Recovery sessions with certified physiotherapists",
    category: "Doctor",
    icon: "Activity",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=160&h=160&fit=crop",
  },
  {
    id: "elder",
    title: "Elder Care",
    description: "Companionship and medical support for seniors",
    category: "Nursing",
    icon: "Users",
    image:
      "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=160&h=160&fit=crop",
  },
  {
    id: "followup",
    title: "Follow-up Care",
    description: "Post-treatment check-ins and medication review",
    category: "Doctor",
    icon: "ClipboardPlus",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&h=160&fit=crop",
  },
];

export const doctorDemo = {
  id: "rohan-mehta",
  name: "Dr. Rohan Mehta",
  specialty: "General Physician",
  experience: "8 years experience",
  rating: 4.8,
  reviews: 128,
  etaMin: 12,
  feeInr: 499,
  languages: "English, Hindi",
  about:
    "Dr. Rohan Mehta is a trusted general physician with 8+ years of experience in home consultations, chronic care, and acute illness management.",
  services: ["General Consultation", "Fever & Infection", "Diabetes Care", "BP Management"],
  avatar:
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop",
};

export const bookingDemo = {
  dateLabel: "Today, 6 Oct 2026",
  timeLabel: "10:30 AM – 11:00 AM",
  address: "12th Main, Indiranagar, Bengaluru 560038",
  timeline: [
    { label: "Booking Confirmed", time: "10:05 AM", done: true },
    { label: "Doctor Assigned", time: "10:07 AM", done: true },
    { label: "Doctor is on the way", time: "Now", done: true, current: true },
    { label: "Arriving at your location", time: "", done: false },
    { label: "Care Started", time: "", done: false },
    { label: "Completed", time: "", done: false },
  ],
};

export const doctorAppDemo = {
  name: "Dr. Rohan Mehta",
  earningsToday: 2450,
  completed: 5,
  upcoming: 2,
  incoming: {
    service: "Doctor at Home",
    patient: "Priya Sharma",
    location: "Indiranagar · 2.4 km",
    countdownSec: 24,
  },
  todayBookings: [
    { patient: "Priya Sharma", time: "Now", status: "On the way" },
    { patient: "Aarav Patel", time: "11:30 AM", status: "Upcoming" },
    { patient: "Meera Iyer", time: "1:00 PM", status: "Upcoming" },
  ],
};

export const onboardingSlides = [
  {
    title: "Trusted Healthcare At Your Home",
    body: "Book verified doctors, nurses, and diagnostics — care that comes to you, when you need it.",
  },
  {
    title: "Live Tracking & Updates",
    body: "Know exactly when your provider is on the way with real-time status and secure chat.",
  },
  {
    title: "Family Care, One App",
    body: "Manage bookings, health records, and payments for everyone you care about.",
  },
  {
    title: "Care. Closer to You.",
    body: "Join Curevanta for reliable healthcare at your doorstep across Bengaluru.",
  },
];
