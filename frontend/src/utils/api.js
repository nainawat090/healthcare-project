import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : 'http://localhost:8000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('hms_user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user.token) config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hms_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Named helpers ────────────────────────────────────────────
export const authAPI = {
  login:    (d) => api.post('/auth/login', d),
  register: (d) => api.post('/auth/register', d),
  refresh:  ()  => api.post('/auth/refresh'),
};

export const patientAPI = {
  getAll:   (p) => api.get('/patients', { params: p }),
  getOne:   (id)=> api.get(`/patients/${id}`),
  create:   (d) => api.post('/patients', d),
  update:   (id,d)=> api.put(`/patients/${id}`, d),
  delete:   (id)=> api.delete(`/patients/${id}`),
  getVitals:(id)=> api.get(`/patients/${id}/vitals`),
};

export const appointmentAPI = {
  getAll:    (p) => api.get('/appointments', { params: p }),
  getOne:    (id)=> api.get(`/appointments/${id}`),
  create:    (d) => api.post('/appointments', d),
  update:    (id,d)=> api.put(`/appointments/${id}`, d),
  cancel:    (id)=> api.patch(`/appointments/${id}/cancel`),
  available: (d,doc)=> api.get('/appointments/available', { params: { date: d, doctor_id: doc } }),
};

export const triageAPI = {
  analyze:   (d) => api.post('/triage/analyze', d),
  queue:     ()  => api.get('/triage/queue'),
  emergency: ()  => api.get('/triage/emergency'),
  update:    (id,d)=> api.patch(`/triage/${id}`, d),
};

export const recordsAPI = {
  getAll:  (pid) => api.get(`/records/${pid}`),
  create:  (d)   => api.post('/records', d),
  getOne:  (id)  => api.get(`/records/detail/${id}`),
};

export const analyticsAPI = {
  overview:    ()  => api.get('/analytics/overview'),
  trends:      (p) => api.get('/analytics/trends', { params: p }),
  departments: ()  => api.get('/analytics/departments'),
};

export const chatbotAPI = {
  chat: (messages, lang='en') => api.post('/chatbot/chat', { messages, language: lang }),
};

export const doctorAPI = {
  getAll:       ()  => api.get('/doctors'),
  getOne:       (id)=> api.get(`/doctors/${id}`),
  getSchedule:  (id,date)=> api.get(`/doctors/${id}/schedule`, { params: { date } }),
  getPatients:  (id)=> api.get(`/doctors/${id}/patients`),
};
