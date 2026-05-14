// ═══════════════════════════════════════════════════════════
//  DEMO DATA — realistic data for frontend-only / hackathon mode
// ═══════════════════════════════════════════════════════════

export const DOCTORS = [
  { id: 1, name: 'Dr. Raj Sharma',   specialty: 'Cardiology',        experience: 12, rating: 4.9, available: true,  slots: ['09:00','10:00','14:00','15:00'], avatar: null },
  { id: 2, name: 'Dr. Priya Gupta',  specialty: 'General Medicine',  experience: 8,  rating: 4.7, available: true,  slots: ['09:30','11:00','13:00','16:00'], avatar: null },
  { id: 3, name: 'Dr. Anil Verma',   specialty: 'Neurology',         experience: 15, rating: 4.8, available: false, slots: [],                               avatar: null },
  { id: 4, name: 'Dr. Sunita Rao',   specialty: 'Pediatrics',        experience: 10, rating: 4.9, available: true,  slots: ['10:00','11:30','14:30'],         avatar: null },
  { id: 5, name: 'Dr. Vikram Nair',  specialty: 'Orthopedics',       experience: 9,  rating: 4.6, available: true,  slots: ['09:00','12:00','15:00','17:00'], avatar: null },
  { id: 6, name: 'Dr. Meena Joshi',  specialty: 'Dermatology',       experience: 7,  rating: 4.5, available: true,  slots: ['10:30','13:30','16:30'],         avatar: null },
];

export const PATIENTS = [
  { id: 101, name: 'Arjun Mehta',    age: 32, gender: 'M', blood: 'O+',  phone: '98765-01234', email: 'arjun@demo.com',  severity: 'LOW',     status: 'waiting',  doctor: 1, queue: 3,  admitted: false },
  { id: 102, name: 'Priya Singh',    age: 45, gender: 'F', blood: 'A+',  phone: '98765-02234', email: 'priya@demo.com',  severity: 'HIGH',    status: 'in_care',  doctor: 2, queue: 1,  admitted: true  },
  { id: 103, name: 'Ravi Kumar',     age: 68, gender: 'M', blood: 'B-',  phone: '98765-03234', email: 'ravi@demo.com',   severity: 'CRITICAL',status: 'emergency',doctor: 1, queue: 0,  admitted: true  },
  { id: 104, name: 'Anita Sharma',   age: 27, gender: 'F', blood: 'AB+', phone: '98765-04234', email: 'anita@demo.com',  severity: 'MEDIUM',  status: 'waiting',  doctor: 4, queue: 5,  admitted: false },
  { id: 105, name: 'Suresh Patil',   age: 55, gender: 'M', blood: 'O-',  phone: '98765-05234', email: 'suresh@demo.com', severity: 'LOW',     status: 'discharged',doctor:2, queue: 0,  admitted: false },
  { id: 106, name: 'Kavya Nair',     age: 8,  gender: 'F', blood: 'A-',  phone: '98765-06234', email: 'kavya@demo.com',  severity: 'HIGH',    status: 'waiting',  doctor: 4, queue: 2,  admitted: false },
  { id: 107, name: 'Deepak Joshi',   age: 41, gender: 'M', blood: 'B+',  phone: '98765-07234', email: 'deepak@demo.com', severity: 'MEDIUM',  status: 'waiting',  doctor: 5, queue: 6,  admitted: false },
  { id: 108, name: 'Meena Kumari',   age: 72, gender: 'F', blood: 'O+',  phone: '98765-08234', email: 'meena@demo.com',  severity: 'CRITICAL',status: 'in_care',  doctor: 1, queue: 0,  admitted: true  },
];

export const APPOINTMENTS = [
  { id: 201, patientId: 101, patientName: 'Arjun Mehta',   doctorId: 2, doctorName: 'Dr. Priya Gupta',  date: '2025-02-05', time: '10:00', type: 'General Checkup',     status: 'confirmed', notes: 'Routine annual checkup' },
  { id: 202, patientId: 102, patientName: 'Priya Singh',   doctorId: 1, doctorName: 'Dr. Raj Sharma',   date: '2025-02-05', time: '11:00', type: 'Cardiology Follow-up', status: 'confirmed', notes: 'BP monitoring' },
  { id: 203, patientId: 104, patientName: 'Anita Sharma',  doctorId: 4, doctorName: 'Dr. Sunita Rao',   date: '2025-02-06', time: '09:30', type: 'Pediatric Review',     status: 'pending',   notes: '' },
  { id: 204, patientId: 107, patientName: 'Deepak Joshi',  doctorId: 5, doctorName: 'Dr. Vikram Nair',  date: '2025-02-07', time: '14:00', type: 'Orthopedic Consult',   status: 'confirmed', notes: 'Knee pain assessment' },
  { id: 205, patientId: 101, patientName: 'Arjun Mehta',   doctorId: 2, doctorName: 'Dr. Priya Gupta',  date: '2025-01-20', time: '10:00', type: 'General Checkup',     status: 'completed', notes: 'All normal' },
];

export const HEALTH_RECORDS = [
  { id: 301, patientId: 101, type: 'Lab Report',   title: 'Complete Blood Count',     date: '2025-01-15', doctor: 'Dr. Priya Gupta',  summary: 'All values within normal range. Hemoglobin: 14.2 g/dL', tags: ['blood', 'routine'] },
  { id: 302, patientId: 101, type: 'Prescription', title: 'Vitamin D Supplement',     date: '2025-01-15', doctor: 'Dr. Priya Gupta',  summary: 'Vitamin D 60,000 IU weekly × 8 weeks', tags: ['medication'] },
  { id: 303, patientId: 101, type: 'Imaging',      title: 'Chest X-Ray',              date: '2025-01-10', doctor: 'Dr. Raj Sharma',    summary: 'No abnormalities detected. Lungs clear.', tags: ['imaging'] },
  { id: 304, patientId: 102, type: 'Lab Report',   title: 'Lipid Profile',            date: '2025-01-20', doctor: 'Dr. Raj Sharma',    summary: 'LDL elevated at 165 mg/dL. Statin therapy recommended.', tags: ['cardiac','blood'] },
  { id: 305, patientId: 102, type: 'ECG',          title: 'Electrocardiogram',        date: '2025-01-18', doctor: 'Dr. Raj Sharma',    summary: 'Mild ST-segment changes noted. Follow-up required.', tags: ['cardiac'] },
  { id: 306, patientId: 103, type: 'Emergency',    title: 'Acute MI Management',      date: '2025-02-01', doctor: 'Dr. Raj Sharma',    summary: 'STEMI confirmed. Thrombolytics administered. ICU admitted.', tags: ['emergency','cardiac'] },
];

export const QUEUE_DATA = [
  { position: 1, patient: PATIENTS[2], waitTime: 0,   symptoms: ['Chest Pain', 'Shortness of Breath'], arrivalTime: '08:15' },
  { position: 2, patient: PATIENTS[1], waitTime: 15,  symptoms: ['High BP', 'Dizziness'],              arrivalTime: '08:30' },
  { position: 3, patient: PATIENTS[5], waitTime: 25,  symptoms: ['Fever', 'Vomiting'],                 arrivalTime: '08:45' },
  { position: 4, patient: PATIENTS[0], waitTime: 40,  symptoms: ['Back Pain'],                         arrivalTime: '09:00' },
  { position: 5, patient: PATIENTS[3], waitTime: 55,  symptoms: ['Headache', 'Fatigue'],               arrivalTime: '09:10' },
  { position: 6, patient: PATIENTS[6], waitTime: 70,  symptoms: ['Knee Pain'],                         arrivalTime: '09:20' },
];

export const ANALYTICS_OVERVIEW = {
  totalPatients:    1248,
  todayAdmissions:  34,
  emergencyCases:   7,
  avgWaitTime:      23,
  bedOccupancy:     78,
  appointmentsToday:42,
  dischargedToday:  28,
  doctorsOnDuty:    12,
};

export const TRENDS_DATA = [
  { month: 'Aug', patients: 980,  emergencies: 45, appointments: 320 },
  { month: 'Sep', patients: 1050, emergencies: 52, appointments: 340 },
  { month: 'Oct', patients: 1120, emergencies: 48, appointments: 380 },
  { month: 'Nov', patients: 1090, emergencies: 61, appointments: 360 },
  { month: 'Dec', patients: 1180, emergencies: 55, appointments: 400 },
  { month: 'Jan', patients: 1248, emergencies: 67, appointments: 420 },
];

export const DEPT_DATA = [
  { name: 'Cardiology',       patients: 240, color: '#f43f5e' },
  { name: 'General Medicine', patients: 380, color: '#14b8a3' },
  { name: 'Orthopedics',      patients: 180, color: '#8b5cf6' },
  { name: 'Pediatrics',       patients: 210, color: '#f59e0b' },
  { name: 'Neurology',        patients: 140, color: '#3b82f6' },
  { name: 'Dermatology',      patients: 98,  color: '#ec4899' },
];

export const NOTIFICATIONS = [
  { id: 1, type: 'emergency', title: 'Critical Alert',        message: 'Patient Ravi Kumar — STEMI detected. ICU required.', time: '2 min ago',  read: false },
  { id: 2, type: 'appointment',title: 'Appointment Reminder', message: 'Dr. Sharma appointment in 30 minutes.',               time: '30 min ago', read: false },
  { id: 3, type: 'lab',        title: 'Lab Report Ready',     message: 'CBC report for Arjun Mehta is available.',            time: '1 hr ago',   read: true  },
  { id: 4, type: 'system',     title: 'System Update',        message: 'EHR system maintenance scheduled at 11 PM tonight.',  time: '2 hr ago',   read: true  },
];

export const SYMPTOMS_LIST = [
  'Chest Pain', 'Shortness of Breath', 'Headache', 'Fever', 'Cough', 'Fatigue',
  'Nausea', 'Vomiting', 'Dizziness', 'Back Pain', 'Abdominal Pain', 'Joint Pain',
  'Rash', 'Swelling', 'Palpitations', 'Blurred Vision', 'Numbness', 'Weakness',
  'Sore Throat', 'Runny Nose', 'Difficulty Swallowing', 'Loss of Appetite',
];

export const SEVERITY_RULES = {
  CRITICAL: ['Chest Pain + Shortness of Breath', 'Loss of Consciousness', 'Severe Bleeding', 'Stroke Symptoms'],
  HIGH:     ['High Fever (>103°F)', 'Severe Abdominal Pain', 'Difficulty Breathing', 'Palpitations'],
  MEDIUM:   ['Moderate Fever', 'Persistent Headache', 'Vomiting', 'Dizziness'],
  LOW:      ['Mild Cough', 'Runny Nose', 'Minor Pain', 'Fatigue'],
};

// ── Chatbot initial messages ──────────────────────────────────
export const CHATBOT_GREETING = {
  en: `Hello! 👋 I'm **MediBot**, your AI health assistant at this hospital.

I can help you with:
• 🩺 Symptom assessment & health guidance
• 📅 Booking appointments
• 💊 Explaining your medical reports
• 🏥 Navigating hospital services

*Note: I provide guidance only — please consult a doctor for medical decisions.*

How can I help you today?`,

  hi: `नमस्ते! 👋 मैं **मेडीबॉट** हूं, आपका AI स्वास्थ्य सहायक।

मैं आपकी इन चीजों में मदद कर सकता हूं:
• 🩺 लक्षण मूल्यांकन
• 📅 अपॉइंटमेंट बुकिंग
• 💊 मेडिकल रिपोर्ट समझाना
• 🏥 अस्पताल सेवाएं

*नोट: मैं केवल मार्गदर्शन प्रदान करता हूं — कृपया चिकित्सीय निर्णयों के लिए डॉक्टर से मिलें।*

आज मैं आपकी कैसे मदद कर सकता हूं?`,
};
