import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('focusforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('focusforge_token');
      localStorage.removeItem('focusforge_user');
      // Dispatch custom event for AuthContext
      window.dispatchEvent(new Event('focusforge_unauthorized'));
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIS ====================
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, avatar) => api.post('/auth/register', { name, email, password, avatar }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  demoLogin: () => api.post('/auth/demo-login'),
  getMe: () => api.get('/auth/me'),
};

// ==================== TASKS APIS ====================
export const taskApi = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  complete: (id) => api.patch(`/tasks/${id}/complete`),
};

// ==================== HABITS APIS ====================
export const habitApi = {
  getAll: () => api.get('/habits'),
  getById: (id) => api.get(`/habits/${id}`),
  create: (data) => api.post('/habits', data),
  update: (id, data) => api.put(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
  logCompletion: (id, data) => api.post(`/habits/${id}/log`, data),
};

// ==================== STREAKS APIS ====================
export const streakApi = {
  get: () => api.get('/streaks'),
};

// ==================== TIMETABLE APIS ====================
export const timetableApi = {
  getWeek: () => api.get('/timetable'),
  create: (data) => api.post('/timetable', data),
  update: (id, data) => api.put(`/timetable/${id}`, data),
  delete: (id) => api.delete(`/timetable/${id}`),
};

// ==================== ANALYTICS APIS ====================
export const analyticsApi = {
  getDaily: (date) => api.get('/analytics/daily', { params: { date } }),
  getWeekly: (startDate) => api.get('/analytics/weekly', { params: { startDate } }),
  getMonthly: (year, month) => api.get('/analytics/monthly', { params: { year, month } }),
  getCategories: () => api.get('/analytics/categories'),
  getHeatmap: () => api.get('/analytics/heatmap'),
};

// ==================== GOALS APIS ====================
export const goalApi = {
  getAll: () => api.get('/goals'),
  getById: (id) => api.get(`/goals/${id}`),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
  complete: (id) => api.patch(`/goals/${id}/complete`),
  updateProgress: (id, progress_percent) => api.patch(`/goals/${id}/progress`, { progress_percent }),
};

// ==================== NOTES APIS ====================
export const noteApi = {
  getAll: (params) => api.get('/notes', { params }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

// ==================== CALENDAR APIS ====================
export const calendarApi = {
  getMonthView: (year, month) => api.get('/calendar/month', { params: { year, month } }),
  getEvents: () => api.get('/calendar/events'),
  createEvent: (data) => api.post('/calendar/events', data),
  updateEvent: (id, data) => api.put(`/calendar/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/calendar/events/${id}`),
};

// ==================== POMODORO APIS ====================
export const pomodoroApi = {
  logSession: (data) => api.post('/pomodoro/sessions', data),
  getHistory: (limit) => api.get('/pomodoro/sessions', { params: { limit } }),
};

// ==================== BADGES APIS ====================
export const badgeApi = {
  getAll: () => api.get('/badges'),
};

// ==================== USER APIS ====================
export const userApi = {
  getProfile: () => api.get('/user/profile'),
  getXpHistory: () => api.get('/user/xp-history'),
  getStats: () => api.get('/user/stats'),
  updateSettings: (data) => api.put('/user/settings', data),
  updateProfile: (data) => api.put('/user/settings', data),
  getDashboard: () => api.get('/dashboard'),
};

export default api;
