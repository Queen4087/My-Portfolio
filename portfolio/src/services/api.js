const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ── Token helpers ──────────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem('adminToken');
export const setToken = (t) => localStorage.setItem('adminToken', t);
export const removeToken = () => localStorage.removeItem('adminToken');

// ── Core fetch wrapper ─────────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

const get = (url) => request(url);
const post = (url, body) => request(url, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) });
const put = (url, body) => request(url, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) });
const patch = (url, body) => request(url, { method: 'PATCH', body: JSON.stringify(body) });
const del = (url) => request(url, { method: 'DELETE' });

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (username, password) => post('/auth/login', { username, password }),
  me: () => get('/auth/me'),
  logout: () => post('/auth/logout', {}),
  changePassword: (currentPassword, newPassword) => post('/auth/change-password', { currentPassword, newPassword }),
};

// ── Profile ────────────────────────────────────────────────────────────────────
export const profileAPI = {
  get: () => get('/profile'),
  update: (data) => put('/profile', data),
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return post('/profile/upload-image', fd);
  },
  uploadCV: (file) => {
    const fd = new FormData();
    fd.append('cv', file);
    return post('/profile/upload-cv', fd);
  },
  removeImage: () => del('/profile/remove-image'),
};

// ── Projects ───────────────────────────────────────────────────────────────────
export const projectsAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/projects${q ? '?' + q : ''}`);
  },
  getOne: (id) => get(`/projects/${id}`),
  create: (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'imageFile' && v instanceof File) fd.append('imageFile', v);
      else if (k === 'tags') fd.append('tags', Array.isArray(v) ? v.join(',') : v);
      else if (v !== undefined && v !== null) fd.append(k, v);
    });
    return post('/projects', fd);
  },
  update: (id, data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'imageFile' && v instanceof File) fd.append('imageFile', v);
      else if (k === 'tags') fd.append('tags', Array.isArray(v) ? v.join(',') : v);
      else if (v !== undefined && v !== null) fd.append(k, v);
    });
    return request(`/projects/${id}`, { method: 'PUT', body: fd });
  },
  delete: (id) => del(`/projects/${id}`),
};

// ── Skills ─────────────────────────────────────────────────────────────────────
export const skillsAPI = {
  getAll: () => get('/skills'),
  create: (data) => post('/skills', data),
  update: (id, data) => put(`/skills/${id}`, data),
  delete: (id) => del(`/skills/${id}`),
};

// ── Messages ───────────────────────────────────────────────────────────────────
export const messagesAPI = {
  send: (data) => post('/messages', data),
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return get(`/messages${q ? '?' + q : ''}`);
  },
  markRead: (id) => patch(`/messages/${id}/read`, {}),
  markAllRead: () => patch('/messages/mark-all-read', {}),
  delete: (id) => del(`/messages/${id}`),
};

// ── Uploads URL helper ─────────────────────────────────────────────────────────
export const uploadsURL = (filename) =>
  filename ? `${BASE_URL.replace('/api', '')}/uploads/${filename}` : null;
