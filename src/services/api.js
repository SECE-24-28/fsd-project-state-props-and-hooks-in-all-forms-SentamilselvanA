import axios from 'axios';

const RAW_API_URL = process.env.REACT_APP_API_URL;

// Guard against both missing AND the string "undefined" that React bakes in
// when the env var is not set during `npm run build`
if (!RAW_API_URL || RAW_API_URL === 'undefined' || !RAW_API_URL.startsWith('http')) {
  throw new Error(
    `[api.js] REACT_APP_API_URL is invalid: "${RAW_API_URL}".\n` +
    'Local dev  → set it in client/.env\n' +
    'Render     → Environment tab → Add Build Environment Variable:\n' +
    '             REACT_APP_API_URL = https://rhythmdance-backend.onrender.com/api\n' +
    '             Then trigger a manual redeploy so the new build bakes the correct URL in.'
  );
}

const API_BASE_URL = RAW_API_URL.replace(/\/$/, ''); // strip trailing slash

console.log('[api.js] baseURL:', API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const isAuthRoute = err.config?.url?.includes('/auth/');
    if (err.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
